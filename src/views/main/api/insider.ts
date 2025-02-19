import { apiClient, type ApiResponse } from '@/shared/api';

export interface InsiderRanking {
  postSeq: string;
  rankNum: string;
  postTitle: string;
  categoryCd: string;
  categoryName: string;
  viewCnt: string;
  likeCnt: string;
  commentCnt: string;
  thumbnailPath: string | null;
  regDate: string;
  regTime: string;
}

export const getRankings = async (): Promise<ApiResponse<InsiderRanking[]>> => {
  const response = await apiClient.get('mains/insider/rankings');
  return response.json();
};
