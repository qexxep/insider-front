import {
  QueryClient,
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { ApiResponse } from '@/shared/api/types';
import { QUERY_CONFIG, queryClient } from '@/shared/lib';

import { getBestWorstPostInfo, getPostDetail, getPostListByCategory, postReaction } from './postApi';
import {
  BestWorstPostInfoRequest,
  BestWorstPostInfoResponse,
  PostDeleteRequest,
  PostDeleteResponse,
  PostDetailRequest,
  PostDetailResponse,
  PostListByCategoryRequest,
  PostListResponse,
  PostReactionRequest,
  PostReactionResponse,
} from './types';
import { deletePost } from './writeApi';

export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (params: PostListByCategoryRequest) => [...queryKeys.posts.all, 'list', params] as const,
    detail: (params: PostDetailRequest) => [...queryKeys.posts.all, 'detail', params] as const,
    bestWorst: (params: BestWorstPostInfoRequest) => [...queryKeys.posts.all, 'bestWorst', params] as const,
    reaction: (params: PostReactionRequest) => [...queryKeys.posts.all, 'reaction', params] as const,
  },
  writes: {
    all: ['writes'] as const,
    delete: (params: PostDeleteRequest) => [...queryKeys.writes.all, 'delete', params] as const,
  },
} as const;

export const invalidateQueries = {
  all: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
  list: (payload: PostListByCategoryRequest) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.list(payload) }),
  detail: (payload: PostDetailRequest) => queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(payload) }),
  bestWorst: (payload: BestWorstPostInfoRequest) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.bestWorst(payload) }),
};

export const prefetchQueries = {
  list: async (queryClient: QueryClient, payload: PostListByCategoryRequest) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.posts.list(payload),
      queryFn: () => getPostListByCategory(payload),
      ...QUERY_CONFIG.REAL_TIME,
    });
  },
  detail: async (queryClient: QueryClient, payload: PostDetailRequest) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.posts.detail(payload),
      queryFn: () => getPostDetail(payload),
    });
  },
  bestWorst: async (queryClient: QueryClient, payload: BestWorstPostInfoRequest) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.posts.bestWorst(payload),
      queryFn: () => getBestWorstPostInfo(payload),
    });
  },
};

export const useGetCategoryPostList = (
  payload: PostListByCategoryRequest,
  config?: UseQueryOptions<ApiResponse<PostListResponse>>
) => {
  return useQuery({
    queryKey: queryKeys.posts.list(payload),
    queryFn: () => getPostListByCategory(payload),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useGetBestWorstPostInfo = (
  payload: BestWorstPostInfoRequest,
  config?: UseQueryOptions<ApiResponse<BestWorstPostInfoResponse>>
) => {
  return useQuery({
    queryKey: queryKeys.posts.bestWorst(payload),
    queryFn: () => getBestWorstPostInfo(payload),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useGetPostDetail = (
  payload: PostDetailRequest,
  config?: UseQueryOptions<ApiResponse<PostDetailResponse>>
) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(payload),
    queryFn: () => getPostDetail(payload),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const usePostReaction = (
  config?: UseMutationOptions<ApiResponse<PostReactionResponse>, Error, PostReactionRequest>
) => {
  return useMutation({
    mutationFn: (payload: PostReactionRequest) => postReaction(payload),
    ...config,
  });
};

export const useDeletePost = (
  config?: UseMutationOptions<ApiResponse<PostDeleteResponse>, Error, PostDeleteRequest>
) => {
  return useMutation({
    mutationFn: (payload: PostDeleteRequest) => deletePost(payload),
    ...config,
  });
};
