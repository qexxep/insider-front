import { commentQueryKeys } from '@/feature/comment';
import {
  CommentListRequest,
  CreateCommentRequest,
  DeleteCommentRequest,
  UpdateCommentRequest,
} from '@/feature/comment/api/type';
import { postQueryKeys } from '@/views/posts';
import { BestWorstPostInfoRequest, PostDetailRequest } from '@/views/posts/api/types';
import { PostListByCategoryRequest } from '@/views/posts/api/types';

import { queryClient } from './queryClient';

export const invalidateQueries = {
  posts: {
    all: () => queryClient.invalidateQueries({ queryKey: postQueryKeys.posts.all }),
    list: (payload: PostListByCategoryRequest) =>
      queryClient.invalidateQueries({ queryKey: postQueryKeys.posts.list(payload) }),
    detail: (payload: PostDetailRequest) =>
      queryClient.invalidateQueries({ queryKey: postQueryKeys.posts.detail(payload) }),
    bestWorst: (payload: BestWorstPostInfoRequest) =>
      queryClient.invalidateQueries({ queryKey: postQueryKeys.posts.bestWorst(payload) }),
  },
  comments: {
    all: () => queryClient.invalidateQueries({ queryKey: commentQueryKeys.comments.all }),
    list: (payload: CommentListRequest) =>
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.comments.list(payload) }),
    create: (payload: CreateCommentRequest) =>
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.comments.create(payload) }),
    delete: (payload: DeleteCommentRequest) =>
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.comments.delete(payload) }),
    update: (payload: UpdateCommentRequest) =>
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.comments.update(payload) }),
  },
};

// 사용 예시
// const createPost = useMutation({
//   mutationFn: newPost => baseApi.post(newPost),
//   onSuccess: () => {
//     invalidateQueries.posts.list(); // 목록 갱신
//   },
// });
