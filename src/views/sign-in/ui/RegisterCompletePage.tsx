'use client';

import Link from 'next/link';

import { Button, Icons } from '@/shared/ui';

export function RegisterCompletePage() {
  return (
    <div className="mt-24 flex h-full w-full flex-1 flex-col items-center">
      <Icons.checkCircle className="mb-5 h-16 w-16 text-primary" />
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-3 text-3xl font-bold">회원가입 완료!</h1>
        <p className="text-lg font-medium text-muted-foreground">회원가입을 통해 더 많은 토론에 참여해보세요</p>
      </div>
      <div className="flex flex-col gap-4">
        <Button type="submit" className="m-auto mt-10 h-[70px] w-[350px] rounded-[35px] text-lg font-bold">
          나의 성향 테스트 하러 가기
        </Button>
        <Button
          type="submit"
          variant="secondary"
          className="m-auto h-[70px] w-[350px] rounded-[35px] text-lg font-bold"
        >
          <Link href={'/'}>메인페이지로 바로 구경가기</Link>
        </Button>
      </div>
    </div>
  );
}
