import { apiClient, type ApiResponse } from '@/shared/api';

export interface CategoryRecentPost {
  postSeq: string;
  categoryCd: string;
  categoryName: string | null;
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

export interface CategoryInfo {
  recentPostList: CategoryRecentPost[];
  categoryCode: string;
  categoryName: string;
}

export interface MajorCategory {
  majorCategoryName: string;
  commCategoryCode: string;
  categoryList: CategoryInfo[];
}

export const getCategoryRecentPosts = async (): Promise<ApiResponse<MajorCategory[]>> => {
  const response = await apiClient.get('mains/categories/recent-posts');
  return response.json();
};
