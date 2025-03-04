import { useCommonMutation } from '@/shared/api';
import { toast } from '@/shared/hooks';

import { writeApi } from '../api';

// 응답 타입들도 export 해서 재사용할 수 있게 합니다
export interface CreatePostResponse {
  postSeq: string;
}

export interface FileUploadResponse {
  fileUrl: string;
  fileSeq: string;
}

export interface FileUploadRequest {
  postSeq: string;
  file: File;
}

export interface SavePostRequest {
  postSeq: string;
  postTitle: string;
  content: string;
  postTag: string;
  isVote: number;
  voteTitle?: string;
  voteItems?: string[];
}

// 파일 삭제 요청 인터페이스 추가
export interface FileDeleteRequest {
  postSeq: string;
  fileSeq: string;
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

  const deleteFileMutation = useCommonMutation<void, FileDeleteRequest>(writeApi.deleteFile, {
    onError: () => {
      toast({
        variant: 'destructive',
        title: '파일 삭제 실패',
        description: '파일 삭제에 실패했습니다.',
        duration: 2000,
      });
    },
  });

  const savePostMutation = useCommonMutation<void, SavePostRequest>(writeApi.savePost, {
    onError: () => {
      toast({
        variant: 'destructive',
        title: '게시글 저장 실패',
        description: '게시글을 저장하는데 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    },
  });

  return {
    createPostMutation,
    uploadFileMutation,
    deleteFileMutation,
    savePostMutation,
  };
}
