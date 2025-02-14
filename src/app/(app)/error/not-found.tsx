import { ErrorPage } from '@/shared/ui/error/ErrorPage';

export default function AppNotFound() {
  return (
    <ErrorPage statusCode={404} title="오류가 발생하였습니다." description="요청하신 페이지를 찾을 수 없습니다." />
  );
}
