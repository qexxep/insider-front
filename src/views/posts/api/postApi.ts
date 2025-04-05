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
  VoteRequest,
} from './types';

// 게시글 목록 조회
export const getPostListByCategory = (data: PostListByCategoryRequest) =>
  baseApi.post<PostListResponse>('posts/list', data);

// 베스트, 워스트 게시글 조회
export const getBestWorstPostInfo = (data: BestWorstPostInfoRequest) =>
  baseApi.post<BestWorstPostInfoResponse>('posts/list/best-worst', data);

// 게시글 상세 조회
export const getPostDetail = (data: PostDetailRequest) => baseApi.post<PostDetailResponse>('posts/detail', data);

// 게시글 좋아요/싫어요 반응 추가
export const savePostReaction = (data: PostReactionRequest) =>
  baseApi.post<PostReactionResponse>('posts/reaction/save', data);

// 게시글 좋아요/싫어요 반응 제거
export const removePostReaction = (data: PostReactionRequest) =>
  baseApi.post<PostReactionResponse>('posts/reaction/remove', data);

// 게시글 스크랩 추가
export const saveScrap = (data: PostScrapRequest) => baseApi.post<PostScrapResponse>('posts/scrap/save', data);

// 게시글 스크랩 제거
export const removeScrap = (data: PostScrapRequest) => baseApi.post<PostScrapResponse>('posts/scrap/remove', data);

// 투표 항목 선택 저장
export const saveVote = (data: VoteRequest) => baseApi.post<void>('posts/vote/save', data);

// 투표 항목 선택 취소
export const removeVote = (data: VoteRequest) => baseApi.post<void>('posts/vote/remove', data);
