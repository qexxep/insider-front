'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui';

interface ErrorPageProps {
  statusCode: number;
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorPage({ statusCode, title, description, onRetry }: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Image src="/icons/warning.svg" alt="warning" width={56} height={56} className="mb-2" />
      <h2 className="text-xl font-medium">
        <span className="text-2xl font-bold">
          {statusCode} {title}
        </span>
      </h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="flex gap-2">
        <Button variant="destructive" className="mt-4 rounded-full px-8" onClick={() => router.push('/')}>
          이전 페이지로 돌아가기
        </Button>
        {onRetry && (
          <Button variant="outline" className="mt-4 rounded-full px-8" onClick={onRetry}>
            다시 시도하기
          </Button>
        )}
      </div>
    </div>
  );
}
