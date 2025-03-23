import Image from 'next/image';
import { Suspense } from 'react';

import { LoginRequiredModal } from '@/entity/auth';
import { Toaster } from '@/shared/ui';

import AppProvider from './_provider';

export default function Layout({
  children,
  header,
  sidebar,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <AppProvider>
      {/* 헤더 */}
      {header}

      {/* 사이드바 */}
      {sidebar}

      {/* 메인 */}
      <div className="min-h-[calc(100vh - 48px)] ml-[260px] flex flex-col items-center">
        <Suspense fallback={<LoadingSpinner />}>
          <main className="relative w-full max-w-[1200px] flex-1 flex-col p-5">{children}</main>
        </Suspense>

        {/* 푸터 */}
        {footer}
      </div>
      <Toaster />
      <LoginRequiredModal />
    </AppProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="-mt-12 flex min-h-screen flex-1 items-center justify-center">
      <Image src="/icons/loading.svg" alt="loading" width={200} height={200} priority />
    </div>
  );
}
