import { PostDetailType, PostPreviewType } from '../model/types';

export interface PostListByCategoryRequest {
  categoryCd: string;
  currPage: number;
  pageSize: number;
}

export interface PostListResponse {
  totalPostCnt: number;
  categoryCd: string | null;
  categoryName: string | null;
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
