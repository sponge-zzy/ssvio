# API 设计初稿

## 1. 文档说明

第一阶段和第二阶段不需要真实 API。

本文件从第三阶段开始使用，用来指导后端基础接口设计。接口只覆盖最小闭环：用户、影片、分类、收藏、观看历史。后台管理只做影片新增、编辑、上下架，视频地址由管理员手动填写 `playUrl`。

## 2. API 设计原则

- 先满足页面展示，不做复杂能力。
- 字段保持简单，前端能看懂。
- 接口命名清晰。
- 错误返回统一。
- 不提前设计评论、评分、弹幕和转码接口。

## 3. 通用返回格式

成功：

```json
{
  "success": true,
  "data": {}
}
```

失败：

```json
{
  "success": false,
  "message": "错误说明"
}
```

## 4. 用户接口

第三阶段需要基础用户接口。

### 注册

`POST /api/auth/register`

请求：

```json
{
  "username": "demo",
  "password": "123456"
}
```

完成标准：

- 可以创建普通用户。
- 用户名不能重复。

### 登录

`POST /api/auth/login`

请求：

```json
{
  "username": "demo",
  "password": "123456"
}
```

完成标准：

- 登录成功后返回用户信息和登录凭证。
- 登录失败时返回错误说明。

### 获取当前用户

`GET /api/auth/me`

完成标准：

- 登录后能获取当前用户信息。
- 未登录时返回未登录错误。

## 5. 影片接口

### 获取影片列表

`GET /api/videos`

可选查询参数：

- `category`：分类，例如 movie、tv、anime
- `keyword`：搜索关键词
- `status`：后台使用，上架或下架

响应示例：

```json
{
  "success": true,
  "data": [
    {
      "id": "video-001",
      "title": "示例电影",
      "category": "movie",
      "coverUrl": "/uploads/covers/demo.jpg",
      "year": 2026,
      "region": "美国",
      "genres": ["科幻", "冒险"],
      "status": "published"
    }
  ]
}
```

完成标准：

- 前端首页、分类页、搜索页可以使用这个接口展示影片。

### 获取影片详情

`GET /api/videos/:id`

响应示例：

```json
{
  "success": true,
  "data": {
    "id": "video-001",
    "title": "示例电影",
    "category": "movie",
    "coverUrl": "/uploads/covers/demo.jpg",
    "bannerUrl": "/uploads/banners/demo.jpg",
    "description": "影片简介",
    "year": 2026,
    "region": "美国",
    "genres": ["科幻", "冒险"],
    "duration": "1小时58分钟",
    "playUrl": "https://cdn.example.com/demo.mp4",
    "status": "published"
  }
}
```

完成标准：

- 详情页可以展示影片完整信息。
- 播放页可以读取 `playUrl`。

## 6. 分类接口

### 获取分类列表

`GET /api/categories`

响应示例：

```json
{
  "success": true,
  "data": [
    { "id": "movie", "name": "电影" },
    { "id": "tv", "name": "电视剧" },
    { "id": "anime", "name": "动漫" }
  ]
}
```

完成标准：

- 前端导航和分类页可以显示分类。

## 7. 收藏接口

### 获取我的收藏

`GET /api/favorites`

完成标准：

- 用户中心可以展示登录用户收藏的影片。

### 添加收藏

`POST /api/favorites`

请求：

```json
{
  "videoId": "video-001"
}
```

完成标准：

- 用户可以收藏影片。
- 重复收藏不会生成重复数据。

### 取消收藏

`DELETE /api/favorites/:videoId`

完成标准：

- 用户可以取消收藏。

## 8. 观看历史接口

### 获取观看历史

`GET /api/watch-history`

完成标准：

- 用户中心可以展示观看历史。

### 保存观看历史

`POST /api/watch-history`

请求：

```json
{
  "videoId": "video-001",
  "progress": 120
}
```

完成标准：

- 播放页可以保存用户最近观看的影片。
- 同一个用户同一个影片只保留一条最新记录。

## 9. 后台影片管理接口

第三阶段后台只做最小管理能力。

### 新增影片

`POST /api/admin/videos`

请求字段：

- `title`
- `category`
- `coverUrl`
- `bannerUrl`
- `description`
- `year`
- `region`
- `genres`
- `duration`
- `playUrl`
- `status`

完成标准：

- 管理员可以新增影片。
- `playUrl` 由管理员手动填写。

### 编辑影片

`PUT /api/admin/videos/:id`

完成标准：

- 管理员可以修改影片基础信息和播放地址。

### 上架影片

`PATCH /api/admin/videos/:id/publish`

完成标准：

- 上架后普通用户可以看到影片。

### 下架影片

`PATCH /api/admin/videos/:id/unpublish`

完成标准：

- 下架后普通用户不能在前台看到影片。

## 10. 后续阶段接口占位

第四阶段再增加：

- mp4 文件上传接口

第五阶段再增加：

- 转码任务接口
- HLS 播放地址接口

第六阶段再增加：

- 评论接口
- 评分接口
- 弹幕接口

