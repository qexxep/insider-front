export const QUERY_KEYS = {
  CATEGORIES: {
    ALL: ['categories', 'all'] as const,
    BY_ID: (id: string) => ['categories', 'detail', id] as const,
  },
  POSTS: {
    ALL: ['posts', 'all'] as const,
    BY_ID: (id: string) => ['posts', 'detail', id] as const,
    BY_CATEGORY: (categoryId: string) => ['posts', 'by-category', categoryId] as const,
  },
  // 다른 도메인의 쿼리키들도 여기에 추가
} as const;
