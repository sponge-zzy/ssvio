# 数据库设计初稿

## 1. 文档说明

第一阶段和第二阶段不需要数据库。

本文件从第三阶段开始使用。数据库只服务于最小后端闭环：用户、影片、分类、收藏、观看历史。不要提前把评论、评分、弹幕、转码任务全部做进第三阶段。

## 2. 设计原则

- 表结构简单，先满足业务。
- 字段命名清晰，便于前端理解。
- 先支持单个视频播放地址 `playUrl`。
- 多集、评论、评分、弹幕、HLS 转码后续再扩展。

## 3. 用户表 users

用途：

- 保存普通用户和管理员账号。

字段建议：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string 或 bigint | 用户 id |
| username | string | 用户名 |
| password_hash | string | 加密后的密码 |
| nickname | string | 昵称 |
| role | string | user 或 admin |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

第三阶段完成标准：

- 可以创建用户。
- 可以区分普通用户和管理员。
- 管理员可以访问后台影片管理接口。

## 4. 分类表 categories

用途：

- 保存影片分类，例如电影、电视剧、动漫。

字段建议：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string 或 bigint | 分类 id |
| code | string | 分类编码，例如 movie |
| name | string | 分类名称，例如 电影 |
| sort_order | int | 排序 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

第三阶段完成标准：

- 前端可以读取分类列表。
- 影片可以关联一个分类。

## 5. 影片表 videos

用途：

- 保存影片基础信息和播放地址。

字段建议：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string 或 bigint | 影片 id |
| title | string | 影片标题 |
| category_id | string 或 bigint | 分类 id |
| cover_url | string | 封面图地址 |
| banner_url | string | 横幅图地址 |
| description | text | 简介 |
| year | int | 年份 |
| region | string | 地区 |
| genres | string 或 json | 题材标签 |
| duration | string | 时长 |
| play_url | string | 播放地址 |
| status | string | draft、published、unpublished |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

状态说明：

- `draft`：草稿，普通用户不可见。
- `published`：已上架，普通用户可见。
- `unpublished`：已下架，普通用户不可见。

第三阶段完成标准：

- 后台可以新增、编辑影片。
- 后台可以上架、下架影片。
- 前台只展示 `published` 影片。
- 播放页可以读取 `play_url`。

## 6. 收藏表 favorites

用途：

- 保存用户收藏的影片。

字段建议：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string 或 bigint | 收藏 id |
| user_id | string 或 bigint | 用户 id |
| video_id | string 或 bigint | 影片 id |
| created_at | datetime | 收藏时间 |

约束建议：

- `user_id + video_id` 唯一，避免重复收藏。

第三阶段完成标准：

- 用户可以收藏影片。
- 用户可以取消收藏。
- 用户中心可以展示收藏列表。

## 7. 观看历史表 watch_histories

用途：

- 保存用户最近观看过的影片和播放进度。

字段建议：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string 或 bigint | 历史 id |
| user_id | string 或 bigint | 用户 id |
| video_id | string 或 bigint | 影片 id |
| progress | int | 播放进度，单位秒 |
| last_watched_at | datetime | 最近观看时间 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

约束建议：

- `user_id + video_id` 唯一，同一用户同一影片只保存一条最新记录。

第三阶段完成标准：

- 播放页可以保存观看历史。
- 用户中心可以展示观看历史。
- 再次播放同一影片时可以读取最近进度，是否自动续播可后续决定。

## 8. 第四阶段扩展

第四阶段支持 mp4 上传时，可以在 `videos` 表中增加：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| source_file_url | string | 原始 mp4 文件地址 |
| file_size | bigint | 文件大小 |

第四阶段完成标准：

- 管理员上传 mp4 后，系统能保存文件地址。
- `play_url` 可以直接使用上传后的 mp4 地址。

## 9. 第五阶段扩展

第五阶段引入 FFmpeg 和 HLS 时，再新增转码任务表。

### 转码任务表 transcode_jobs

字段建议：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string 或 bigint | 任务 id |
| video_id | string 或 bigint | 影片 id |
| source_file_url | string | 原始视频地址 |
| output_url | string | HLS m3u8 地址 |
| status | string | pending、processing、success、failed |
| error_message | text | 失败原因 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

第五阶段完成标准：

- 上传视频后能创建转码任务。
- 管理员能看到任务状态。
- 转码成功后，影片播放地址变成 m3u8。

## 10. 第六阶段扩展

第六阶段再增加：

- 评论表 comments
- 评分表 ratings
- 弹幕表 danmaku_items

不要在第三阶段提前实现这些表，避免初期复杂度过高。

