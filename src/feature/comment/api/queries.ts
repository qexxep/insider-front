import { useMutation, useQuery } from '@tanstack/react-query';

import { QUERY_CONFIG, QueryConfig } from '@/shared/lib';

import { commentReaction, createComment, deleteComment, getCommentList, updateComment } from './commentApi';
import {
  CommentListRequest,
  CommentReactionRequest,
  CreateCommentRequest,
  DeleteCommentRequest,
  UpdateCommentRequest,
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

export const useCreateComment = (data: CreateCommentRequest, config?: QueryConfig) => {
  return useMutation({
    mutationKey: queryKeys.comments.create(data),
    mutationFn: () => createComment(data),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useDeleteComment = (data: DeleteCommentRequest, config?: QueryConfig) => {
  return useMutation({
    mutationKey: queryKeys.comments.delete(data),
    mutationFn: () => deleteComment(data),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useUpdateComment = (data: UpdateCommentRequest, config?: QueryConfig) => {
  return useMutation({
    mutationKey: queryKeys.comments.update(data),
    mutationFn: () => updateComment(data),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useCommentReaction = (data: CommentReactionRequest, config?: QueryConfig) => {
  return useMutation({
    mutationKey: queryKeys.comments.reaction(data),
    mutationFn: () => commentReaction(data),
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};
