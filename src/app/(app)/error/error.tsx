'use client';

import { useEffect } from 'react';

import { ErrorPage } from '@/shared/ui/error/ErrorPage';
import { showErrorToast } from '@/shared/ui/error/ErrorToast';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // HTTP 상태 코드가 404나 500이 아닌 경우에만 토스트 표시
    if (error.name !== 'NotFoundError' && error.name !== 'ServerError') {
      showErrorToast({
        title: error.name || 'Error',
        description: error.message || '예기치 않은 오류가 발생했습니다',
      });
    }
  }, [error]);

  // 500 에러 페이지 표시
  if (error.name === 'ServerError') {
    return (
      <ErrorPage
        statusCode={500}
        title="오류가 발생하였습니다."
        description="서버와의 통신이 원활하지 않아 데이터를 불러올 수 없습니다."
        onRetry={reset}
      />
    );
  }

  // 기타 에러는 토스트로 표시하고 일반적인 에러 페이지 표시
  return (
    <ErrorPage
      statusCode={400}
      title="오류가 발생하였습니다."
      description={error.message || '요청을 처리하는 중 문제가 발생했습니다.'}
      onRetry={reset}
    />
  );
}
