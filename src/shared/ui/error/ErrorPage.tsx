import { Button } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ErrorPageProps {
  statusCode: number;
  title: string;
  description?: string;
}

export function ErrorPage({ statusCode, title, description }: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Image src="/icons/warning.svg" alt="warning" width={56} height={56} className="mb-2" />
      <h2 className="text-xl font-medium">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <Button variant="destructive" className="mt-4 rounded-full px-8" onClick={() => router.push('/')}>
        이전 페이지로 돌아가기
      </Button>
    </div>
  );
}
