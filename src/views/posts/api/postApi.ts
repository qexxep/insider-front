import { baseApi } from '@/shared/api';

import {
  BestWorstPostInfoRequest,
  BestWorstPostInfoResponse,
  PostDetailRequest,
  PostDetailResponse,
  PostListByCategoryRequest,
  PostListResponse,
  PostReactionRequest,
  PostReactionResponse,
  PostScrapRequest,
  PostScrapResponse,
} from './types';

export const getPostListByCategory = (data: PostListByCategoryRequest) =>
  baseApi.post<PostListResponse>('posts/list', data);

export const getBestWorstPostInfo = (data: BestWorstPostInfoRequest) =>
  baseApi.post<BestWorstPostInfoResponse>('posts/list/best-worst', data);

export const getPostDetail = (data: PostDetailRequest) => baseApi.post<PostDetailResponse>('posts/detail', data);

export const postReaction = (data: PostReactionRequest) =>
  baseApi.post<PostReactionResponse>('posts/reaction/save', data);

export const saveScrap = (data: PostScrapRequest) => baseApi.post<PostScrapResponse>('posts/scrap/save', data);

export const removeScrap = (data: PostScrapRequest) => baseApi.post<PostScrapResponse>('posts/scrap/remove', data);
