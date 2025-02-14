import { ErrorPage } from '@/shared/ui/error/ErrorPage';

// 애플리케이션 전체의 기본 404 페이지
// 로그인하지 않은 사용자가 접근하는 페이지나 (app) 그룹 외부의 라우트에서 발생하는 404 에러를 처리

export default function GlobalNotFound() {
  return (
    <ErrorPage statusCode={404} title="오류가 발생하였습니다." description="요청하신 페이지를 찾을 수 없습니다." />
  );
}
