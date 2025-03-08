import { baseApi } from '@/shared/api';

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
} from './type';

export const getCommentList = (data: CommentListRequest) => baseApi.post<CommentListResponse>('comments/list', data);

export const createComment = (data: CreateCommentRequest) =>
  baseApi.post<CreateCommentResponse>('comments/create', data);

export const deleteComment = (data: DeleteCommentRequest) =>
  baseApi.post<DeleteCommentResponse>('comments/delete', data);

export const updateComment = (data: UpdateCommentRequest) =>
  baseApi.post<UpdateCommentResponse>('comments/update', data);

export const commentReaction = (data: CommentReactionRequest) =>
  baseApi.post<CommentReactionResponse>('comments/reaction', data);
