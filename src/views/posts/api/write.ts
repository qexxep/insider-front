import { type ApiResponse, baseApi } from '@/shared/api';

// 게시글 생성 응답 타입
interface CreatePostResponse {
  postSeq: string;
}

// 파일 업로드 응답 타입
interface FileUploadResponse {
  fileSeq: string;
  fileUrl: string;
}

// 파일 업로드 요청 타입
interface FileUploadRequest {
  postSeq: string;
  file: File;
}

// 게시글 생성 요청 타입 추가
interface CreatePostRequest {
  categoryCd: string;
}

// 게시글 저장 요청 타입
interface SavePostRequest {
  postSeq: string;
  postTitle: string;
  content: string;
  postTag: string;
  isVote: number;
  voteTitle?: string;
  voteItems?: string[];
}

// 파일 삭제 요청 타입 추가
interface FileDeleteRequest {
  postSeq: string;
  fileSeq: string;
}

// API 함수들
export const writeApi = {
  createPost: (params: CreatePostRequest) =>
    baseApi.post<ApiResponse<CreatePostResponse>>('writes/create', {
      json: params, // categoryCd를 포함한 요청 body 전달
    }),

  uploadFile: ({ postSeq, file }: FileUploadRequest) => {
    const formData = new FormData();
    const requestBlob = new Blob([JSON.stringify({ postSeq })], { type: 'application/json' });
    formData.append('file', file);
    formData.append('request', requestBlob);

    return baseApi.post<ApiResponse<FileUploadResponse>>('writes/file-upload', {
      body: formData,
      // FormData를 사용할 때는 Content-Type 헤더를 설정하지 않음 (자동으로 설정됨)
    });
  },

  savePost: (params: SavePostRequest) =>
    baseApi.post<ApiResponse<void>>('writes/save', {
      json: params,
    }),

  deleteFile: (params: FileDeleteRequest) =>
    baseApi.post<ApiResponse<void>>('writes/file-delete', {
      json: params,
    }),
};
