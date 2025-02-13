import { apiClient, type ApiResponse } from '@/shared/api';

export interface CategoryRecentPost {
  postSeq: string;
  categoryCd: string;
  categoryName: string;
  postTitle: string;
  previewContent: string;
  viewCnt: string;
  likeCnt: string;
  unlikeCnt: string;
  commentCnt: string;
  postTag: string;
  thumbnailPath: string;
  regId: string;
  regDate: string;
  regTime: string;
  updId: string;
  updDate: string;
  updTime: string;
}

// Key is categoryCd (e.g., "003007"), value is array of posts
type CategoryRecentPostsResponse = Record<string, CategoryRecentPost[]>;

export const getCategoryRecentPosts = async (): Promise<ApiResponse<CategoryRecentPostsResponse>> => {
  const response = await apiClient.get('/api/mains/categories/recent-posts');
  return response.json();
};
