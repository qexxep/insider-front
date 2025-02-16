import { ErrorPage } from '@/shared/ui/error/ErrorPage';

// (app) 라우트 그룹 내부에서만 사용되는 404 페이지
// 로그인한 사용자의 레이아웃(헤더, 사이드바 등)을 유지하면서 404 에러를 표시

export default function AppNotFound() {
  return (
    <ErrorPage statusCode={404} title="오류가 발생하였습니다." description="요청하신 페이지를 찾을 수 없습니다." />
  );
}
