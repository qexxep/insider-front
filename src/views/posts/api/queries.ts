import {
  QueryClient,
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { ApiResponse } from '@/shared/api/types';
import { QUERY_CONFIG, queryClient } from '@/shared/lib';

import {
  getBestWorstPostInfo,
  getPostDetail,
  getPostListByCategory,
  removeScrap,
  savePostReaction,
  saveScrap,
} from './postApi';
import {
  BestWorstPostInfoRequest,
  BestWorstPostInfoResponse,
  CreatePostRequest,
  CreatePostResponse,
  FileDeleteRequest,
  FileUploadRequest,
  FileUploadResponse,
  PostDeleteRequest,
  PostDeleteResponse,
  PostDetailRequest,
  PostDetailResponse,
  PostListByCategoryRequest,
  PostListResponse,
  PostReactionRequest,
  PostReactionResponse,
  PostScrapRequest,
  PostScrapResponse,
  SavePostRequest,
} from './types';
import { createPost, deleteFile, deletePost, savePost, uploadFile } from './writeApi';

export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (params: PostListByCategoryRequest) => [...queryKeys.posts.all, 'list', params] as const,
    detail: (params: PostDetailRequest) => [...queryKeys.posts.all, 'detail', params] as const,
    bestWorst: (params: BestWorstPostInfoRequest) => [...queryKeys.posts.all, 'bestWorst', params] as const,
    reaction: (params: PostReactionRequest) => [...queryKeys.posts.all, 'reaction', params] as const,
    saveScrap: (params: PostScrapRequest) => [...queryKeys.posts.all, 'save', params] as const,
    removeScrap: (params: PostScrapRequest) => [...queryKeys.posts.all, 'remove', params] as const,
  },
  writes: {
    all: ['writes'] as const,
    create: (params: CreatePostRequest) => [...queryKeys.writes.all, 'create', params] as const,
    upload: (params: FileUploadRequest) => [...queryKeys.writes.all, 'upload', params] as const,
    save: (params: SavePostRequest) => [...queryKeys.writes.all, 'save', params] as const,
    deleteFile: (params: FileDeleteRequest) => [...queryKeys.writes.all, 'deleteFile', params] as const,
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
  saveScrap: (payload: PostScrapRequest) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.saveScrap(payload) }),
  removeScrap: (payload: PostScrapRequest) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.removeScrap(payload) }),
  writes: () => queryClient.invalidateQueries({ queryKey: queryKeys.writes.all }),
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
  saveScrap: async (queryClient: QueryClient, payload: PostScrapRequest) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.posts.saveScrap(payload),
      queryFn: () => saveScrap(payload),
    });
  },
  removeScrap: async (queryClient: QueryClient, payload: PostScrapRequest) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.posts.removeScrap(payload),
      queryFn: () => removeScrap(payload),
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
  config?: Partial<UseQueryOptions<ApiResponse<PostDetailResponse>>>
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
    mutationFn: (payload: PostReactionRequest) => savePostReaction(payload),
    ...config,
  });
};

export const useCreatePost = (
  config?: UseMutationOptions<ApiResponse<CreatePostResponse>, Error, CreatePostRequest>
) => {
  return useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    ...config,
  });
};

export const useUploadFile = (
  config?: UseMutationOptions<ApiResponse<FileUploadResponse>, Error, FileUploadRequest>
) => {
  return useMutation({
    mutationFn: (payload: FileUploadRequest) => uploadFile(payload),
    ...config,
  });
};

export const useSavePost = (config?: UseMutationOptions<ApiResponse<void>, Error, SavePostRequest>) => {
  return useMutation({
    mutationFn: (payload: SavePostRequest) => savePost(payload),
    ...config,
  });
};

export const useDeleteFile = (config?: UseMutationOptions<ApiResponse<void>, Error, FileDeleteRequest>) => {
  return useMutation({
    mutationFn: (payload: FileDeleteRequest) => deleteFile(payload),
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

export const useSaveScrap = (config?: UseMutationOptions<ApiResponse<PostScrapResponse>, Error, PostScrapRequest>) => {
  return useMutation({
    mutationFn: (payload: PostScrapRequest) => saveScrap(payload),
    ...config,
  });
};

export const useDeleteScrap = (
  config?: UseMutationOptions<ApiResponse<PostScrapResponse>, Error, PostScrapRequest>
) => {
  return useMutation({
    mutationFn: (payload: PostScrapRequest) => removeScrap(payload),
    ...config,
  });
};
