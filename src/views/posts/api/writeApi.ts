import { baseApi } from '@/shared/api';

import { PostDeleteRequest, PostDeleteResponse } from './types';

export const deletePost = (data: PostDeleteRequest) => baseApi.post<PostDeleteResponse>('writes/delete', data);
