import { PostPreviewType } from '../model/types';

export interface PostListResponse {
  totalPostCnt: number;
  categoryCd: string;
  categoryName: string;
  posts: PostPreviewType[];
}
