import { toast } from '@/shared/hooks';
import { useCommonMutation } from '@/shared/hooks/query/useCommonMutation';

import { writeApi } from '../api/write';

// 응답 타입들도 export 해서 재사용할 수 있게 합니다
export interface CreatePostResponse {
  postSeq: string;
}

export interface FileUploadResponse {
  url: string;
}

export interface FileUploadRequest {
  postSeq: string;
  file: File;
}

export function useWrite() {
  const createPostMutation = useCommonMutation<CreatePostResponse, { categoryCd: string }>(writeApi.createPost, {
    onError: () => {
      toast({
        variant: 'destructive',
        title: '게시글 생성 실패',
        description: '게시글을 생성하는데 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    },
  });

  const uploadFileMutation = useCommonMutation<FileUploadResponse, FileUploadRequest>(writeApi.uploadFile, {
    onError: () => {
      toast({
        variant: 'destructive',
        title: '파일 업로드 실패',
        description: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    },
  });

  return {
    createPostMutation,
    uploadFileMutation,
  };
}
