import { type ApiResponse, baseApi } from '@/shared/api';

// Types
export interface CategoryItem {
  categoryCode: string;
  categoryName: string;
}

export interface CategoryGroup {
  majorCategoryName: string;
  commCategoryCode: string;
  categoryList: CategoryItem[];
}

// API Functions
export async function getCategories(): Promise<ApiResponse<CategoryGroup[]>> {
  return await baseApi.get('mains/categories/all');
}
