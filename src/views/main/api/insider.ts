import { type ApiResponse, baseApi } from '@/shared/api';

import { InsiderRanking } from './types';
export const getRankings = async (): Promise<ApiResponse<InsiderRanking[]>> =>
  await baseApi.get('mains/insider/rankings');
