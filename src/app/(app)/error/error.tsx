'use client';

import { ErrorPage } from '@/shared/ui/error/ErrorPage';
import { showErrorToast } from '@/shared/ui/error/ErrorToast';
import { useEffect } from 'react';

// (app) 라우트 그룹 내부에서만 사용되는 404 페이지
// 로그인한 사용자의 레이아웃(헤더, 사이드바 등)을 유지하면서 404 에러를 표시

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 에러 로깅 등의 처리
    showErrorToast({
      title: 'Error',
      description: '예기치 않은 오류가 발생했습니다',
    });
  }, [error]);

  return (
    <ErrorPage
      statusCode={500}
      title="오류가 발생하였습니다."
      description="서버와의 통신이 원활하지 않아 데이터를 불러올 수 없습니다."
    />
  );
}
