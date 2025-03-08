import { useMutation, useQuery } from '@tanstack/react-query';

import { QUERY_CONFIG, QueryConfig } from '@/shared/lib';

import { getBestWorstPostInfo, getPostDetail, getPostListByCategory, postReaction } from './postApi';
import { BestWorstPostInfoRequest, PostDetailRequest, PostListByCategoryRequest, PostReactionRequest } from './types';

export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (params: PostListByCategoryRequest) => [...queryKeys.posts.all, 'list', params] as const,
    detail: (params: PostDetailRequest) => [...queryKeys.posts.all, 'detail', params] as const,
    bestWorst: (params: BestWorstPostInfoRequest) => [...queryKeys.posts.all, 'bestWorst', params] as const,
    reaction: (params: PostReactionRequest) => [...queryKeys.posts.all, 'reaction', params] as const,
  },
} as const;

export const useGetCategoryPostList = (payload: PostListByCategoryRequest, config?: QueryConfig) => {
  return useQuery({
    queryKey: queryKeys.posts.list(payload),
    queryFn: () => getPostListByCategory(payload),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useGetBestWorstPostInfo = (payload: BestWorstPostInfoRequest, config?: QueryConfig) => {
  return useQuery({
    queryKey: queryKeys.posts.bestWorst(payload),
    queryFn: () => getBestWorstPostInfo(payload),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useGetPostDetail = (payload: PostDetailRequest, config?: QueryConfig) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(payload),
    queryFn: () => getPostDetail(payload),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const usePostReaction = (payload: PostReactionRequest, config?: QueryConfig) => {
  return useMutation({
    mutationKey: queryKeys.posts.reaction(payload),
    mutationFn: () => postReaction(payload),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};
