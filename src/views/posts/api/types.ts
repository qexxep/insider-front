import type { CategoryItem } from '@/app/(app)/@sidebar/api/category';

import { PostDetailType, PostPreviewType } from '../model/types';
export interface PostListByCategoryRequest {
  categoryCd: string;
  currPage: number;
  pageSize: number;
  sortType: 'A' | 'D' | 'R'; // A: 등록순/ D:최신순 / R:추천순
}

export interface PostListResponse {
  totalPostCnt: number;
  totalCommonPostCnt: number;
  categoryCd: string | null;
  categoryName: string | null;
  commonPosts: PostPreviewType;
  posts: PostPreviewType[];
}

export interface BestWorstPostInfoRequest {
  categoryCd: string;
}
export interface BestWorstPostInfoResponse {
  bestPostInfo: PostPreviewType;
  worstPostInfo: PostPreviewType;
}

export interface PostDetailRequest {
  postSeq: string;
}

export type PostDetailResponse = PostDetailType;

export interface PostReactionRequest {
  postSeq: string;
  reactionType: 'like' | 'unlike';
  actionType: 'add' | 'remove' | 'toggle';
}

export type PostReactionResponse = void;

export interface PostDeleteRequest {
  postSeq: string;
  fileExistYn: 'N' | 'Y'; // 파일 등록 여부
}

export type PostDeleteResponse = void;

export interface PostScrapRequest {
  postSeq: string;
}

export interface PostScrapResponse {
  scrapSeq: string;
}

// 게시글 생성 요청 타입
export interface CreatePostRequest {
  categoryCd: string;
}

// 게시글 생성 응답 타입
export interface CreatePostResponse {
  postSeq: string;
}

// 파일 업로드 요청 타입
export interface FileUploadRequest {
  postSeq: string;
  file: File;
}

// 파일 업로드 응답 타입
export interface FileUploadResponse {
  fileSeq: string;
  fileUrl: string;
}

// 게시글 저장 요청 타입
export interface SavePostRequest {
  postSeq: string;
  postTitle: string;
  content: string;
  categoryCd: string;
  postTagList: string[];
  isVote: number;
  voteTitle?: string;
  voteItems?: string[];
}
export type SavePostResponse = void;

// 파일 삭제 요청 타입
export interface FileDeleteRequest {
  postSeq: string;
  fileSeq: string;
}
export type FileDeleteResponse = void;

export type { CategoryItem };
