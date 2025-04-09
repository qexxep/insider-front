import { type ApiResponse, baseApi } from '@/shared/api';

import { MajorCategory } from './types';

export const getCategoryRecentPosts = async (): Promise<ApiResponse<MajorCategory[]>> =>
  await baseApi.get('mains/categories/recent-posts');
