import { QueryClient } from '@tanstack/react-query';

import { getCommentList } from '@/feature/comment';
import { commentQueryKeys } from '@/feature/comment';
import { CommentListRequest } from '@/feature/comment/api/type';
import { getBestWorstPostInfo, getPostDetail, getPostListByCategory, postQueryKeys } from '@/views/posts';
import { BestWorstPostInfoRequest, PostDetailRequest, PostListByCategoryRequest } from '@/views/posts/api/types';

export const prefetchQueries = {
  comments: {
    list: async (queryClient: QueryClient, payload: CommentListRequest) => {
      await queryClient.prefetchQuery({
        queryKey: commentQueryKeys.comments.list(payload),
        queryFn: () => getCommentList(payload),
      });
    },
  },
  posts: {
    list: async (queryClient: QueryClient, payload: PostListByCategoryRequest) => {
      await queryClient.prefetchQuery({
        queryKey: postQueryKeys.posts.list(payload),
        queryFn: () => getPostListByCategory(payload),
      });
    },
    detail: async (queryClient: QueryClient, payload: PostDetailRequest) => {
      await queryClient.prefetchQuery({
        queryKey: postQueryKeys.posts.detail(payload),
        queryFn: () => getPostDetail(payload),
      });
    },
    bestWorst: async (queryClient: QueryClient, payload: BestWorstPostInfoRequest) => {
      await queryClient.prefetchQuery({
        queryKey: postQueryKeys.posts.bestWorst(payload),
        queryFn: () => getBestWorstPostInfo(payload),
      });
    },
  },
};
