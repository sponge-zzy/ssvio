import type { CommentItem } from '../types/interactions'
import { readStorageList, writeStorageList } from './localStorage'

const COMMENTS_KEY = 'videonet_comments'

export function getComments() {
  return readStorageList<CommentItem>(COMMENTS_KEY)
}

export function getCommentsByVideo(videoId: string) {
  return getComments()
    .filter((comment) => comment.videoId === videoId)
    .sort(
      (leftComment, rightComment) =>
        new Date(rightComment.createdAt).getTime() -
        new Date(leftComment.createdAt).getTime(),
    )
}

export function addComment(videoId: string, content: string) {
  const newComment: CommentItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    videoId,
    content,
    createdAt: new Date().toISOString(),
  }

  writeStorageList(COMMENTS_KEY, [newComment, ...getComments()])
}

export function deleteComment(commentId: string) {
  const nextComments = getComments().filter((comment) => comment.id !== commentId)

  writeStorageList(COMMENTS_KEY, nextComments)
}
