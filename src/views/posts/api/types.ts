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
  commonPosts: PostPreviewType[];
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
  fileExistYn: 'N' | 'Y'; // 파일 등록 여부(
}

export type PostDeleteResponse = void;
