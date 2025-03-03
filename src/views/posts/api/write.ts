import { apiClient, type ApiResponse } from '@/shared/api';

// 게시글 생성 응답 타입
interface CreatePostResponse {
  postSeq: string;
}

// 파일 업로드 응답 타입
interface FileUploadResponse {
  url: string;
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

// API 함수들
export const writeApi = {
  createPost: (params: CreatePostRequest) =>
    apiClient
      .post('writes/create', {
        json: params, // categoryCd를 포함한 요청 body 전달
      })
      .json<ApiResponse<CreatePostResponse>>(),

  uploadFile: ({ postSeq, file }: FileUploadRequest) => {
    const formData = new FormData();

    // request는 단순 문자열로
    formData.append('request', JSON.stringify({ postSeq }));

    // file은 그대로 전송
    formData.append('file', file);

    // FormData 내용 확인용 로그
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    return apiClient
      .post('writes/file-upload', {
        body: formData,
        // headers를 완전히 제거하거나, Accept만 설정
        // Content-Type은 설정하지 않음 - 브라우저가 자동으로 처리
      })
      .json<ApiResponse<FileUploadResponse>>();
  },
};
