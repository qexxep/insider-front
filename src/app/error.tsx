'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/shared/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">죄송합니다. 문제가 발생했습니다.</h1>
        <p className="text-muted-foreground">잠시 후 다시 시도해주세요.</p>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => router.push('/')} variant="outline">
          홈으로 가기
        </Button>
        <Button onClick={reset}>다시 시도하기</Button>
      </div>
    </div>
  );
}
