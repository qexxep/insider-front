import {
  QueryClient,
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { ApiResponse } from '@/shared/api/types';
import { QUERY_CONFIG, queryClient } from '@/shared/lib';

import { commentReaction, createComment, deleteComment, getCommentList, updateComment } from './commentApi';
import {
  CommentListRequest,
  CommentListResponse,
  CommentReactionRequest,
  CommentReactionResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from './types';

export const queryKeys = {
  comments: {
    all: ['comments'] as const,
    list: (params: CommentListRequest) => [...queryKeys.comments.all, 'list', params] as const,
  },
} as const;

export const invalidateQueries = {
  lists: () => queryClient.invalidateQueries({ queryKey: queryKeys.comments.all }),
  list: (data: CommentListRequest) => queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(data) }),
};

export const prefetchQueries = {
  list: async (queryClient: QueryClient, payload: CommentListRequest) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.comments.list(payload),
      queryFn: () => getCommentList(payload),
    });
  },
};

export const useCommentList = (
  data: CommentListRequest,
  config?: UseQueryOptions<ApiResponse<CommentListResponse>>
) => {
  return useQuery({
    queryKey: queryKeys.comments.list(data),
    queryFn: () => getCommentList(data),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useCreateComment = (
  config?: UseMutationOptions<ApiResponse<CreateCommentResponse>, Error, CreateCommentRequest>
) => {
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => createComment(data),
    ...config,
  });
};

export const useDeleteComment = (
  config?: UseMutationOptions<ApiResponse<DeleteCommentResponse>, Error, DeleteCommentRequest>
) => {
  return useMutation({
    mutationFn: (data: DeleteCommentRequest) => deleteComment(data),
    ...config,
  });
};

export const useUpdateComment = (
  config?: UseMutationOptions<ApiResponse<UpdateCommentResponse>, Error, UpdateCommentRequest>
) => {
  return useMutation({
    mutationFn: (data: UpdateCommentRequest) => updateComment(data),
    ...config,
  });
};

export const useCommentReaction = (
  config?: UseMutationOptions<ApiResponse<CommentReactionResponse>, Error, CommentReactionRequest>
) => {
  return useMutation({
    mutationFn: (data: CommentReactionRequest) => commentReaction(data),
    ...config,
  });
};
