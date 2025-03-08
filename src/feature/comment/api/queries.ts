import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@/shared/api/types';
import { MutationConfig, QUERY_CONFIG, QueryConfig } from '@/shared/lib';

import { commentReaction, createComment, deleteComment, getCommentList, updateComment } from './commentApi';
import {
  CommentListRequest,
  CommentReactionRequest,
  CommentReactionResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from './type';

export const queryKeys = {
  comments: {
    all: ['comments'] as const,
    list: (params: CommentListRequest) => [...queryKeys.comments.all, 'list', params] as const,
    create: (params: CreateCommentRequest) => [...queryKeys.comments.all, 'create', params] as const,
    delete: (params: DeleteCommentRequest) => [...queryKeys.comments.all, 'delete', params] as const,
    update: (params: UpdateCommentRequest) => [...queryKeys.comments.all, 'update', params] as const,
    reaction: (params: CommentReactionRequest) => [...queryKeys.comments.all, 'reaction', params] as const,
  },
} as const;

export const useCommentList = (data: CommentListRequest, config?: QueryConfig) => {
  return useQuery({
    queryKey: queryKeys.comments.list(data),
    queryFn: () => getCommentList(data),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useCreateComment = (
  config?: MutationConfig<ApiResponse<CreateCommentResponse>, Error, CreateCommentRequest>
) => {
  return useMutation({
    mutationFn: (data: CreateCommentRequest) => createComment(data),
    ...config,
  });
};

export const useDeleteComment = (
  config?: MutationConfig<ApiResponse<DeleteCommentResponse>, Error, DeleteCommentRequest>
) => {
  return useMutation({
    mutationFn: (data: DeleteCommentRequest) => deleteComment(data),
    ...config,
  });
};

export const useUpdateComment = (
  config?: MutationConfig<ApiResponse<UpdateCommentResponse>, Error, UpdateCommentRequest>
) => {
  return useMutation({
    mutationFn: (data: UpdateCommentRequest) => updateComment(data),
    ...config,
  });
};

export const useCommentReaction = (
  config?: MutationConfig<ApiResponse<CommentReactionResponse>, Error, CommentReactionRequest>
) => {
  return useMutation({
    mutationFn: (data: CommentReactionRequest) => commentReaction(data),
    ...config,
  });
};
