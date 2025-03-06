import { PostDetailType, PostPreviewType } from '../model/types';

export interface PostListResponse {
  totalPostCnt: number;
  categoryCd: string | null;
  categoryName: string | null;
  posts: PostPreviewType[];
}

export interface BestWorstPostInfoResponse {
  bestPostInfo: PostPreviewType;
  worstPostInfo: PostPreviewType;
}

export type PostDetailResponse = PostDetailType;
