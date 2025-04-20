import { baseApi } from '@/shared/api';

import { SearchRequest, SearchResponse } from './types';

// 검색 결과 조회 - 공개 API로 인증 필요 없음
export const getSearchResults = (data: SearchRequest) =>
  baseApi.post<SearchResponse>('search/results', data, {
    hooks: {
      beforeRequest: [], // 기본 인증 헤더를 추가하지 않음
      afterResponse: [], // 401 에러 처리를 하지 않음
    },
  });
