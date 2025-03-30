import { createApiClient } from './apiClient';

export type { ApiResponse } from './types';

// Query 관련 export
export { createQueryClient } from './query/client';
export { DEFAULT_MUTATION_OPTIONS, DEFAULT_QUERY_OPTIONS, ENV_SPECIFIC_OPTIONS } from './query/config';
export { QUERY_KEYS } from './query/keys';
export { useCommonMutation } from './query/mutation';
export { useCommonQuery } from './query/query';

// --- REFACTORING ---- //
const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : '/api';

export const baseApi = createApiClient({
  baseUrl: baseUrl!,
});
