import { baseApi } from '@/shared/api';

import {
  CreatePostRequest,
  CreatePostResponse,
  FileDeleteRequest,
  FileDeleteResponse,
  FileUploadRequest,
  FileUploadResponse,
  PostDeleteRequest,
  PostDeleteResponse,
  SavePostRequest,
  SavePostResponse,
} from './types';

export const createPost = (data: CreatePostRequest) => baseApi.post<CreatePostResponse>('writes/create', data);

export const uploadFile = (data: FileUploadRequest) => {
  const { postSeq, file } = data;

  const formData = new FormData();
  const requestBlob = new Blob([JSON.stringify({ postSeq })], { type: 'application/json' });
  formData.append('file', file);
  formData.append('request', requestBlob);

  return baseApi.post<FileUploadResponse>('writes/file-upload', undefined, {
    body: formData,
    headers: {
      'Content-Type': undefined,
    },
  });
};

export const savePost = (data: SavePostRequest) => baseApi.post<SavePostResponse>('writes/save', data);

export const deleteFile = (data: FileDeleteRequest) => baseApi.post<FileDeleteResponse>('writes/file-delete', data);

export const deletePost = (data: PostDeleteRequest) => baseApi.post<PostDeleteResponse>('writes/delete', data);
