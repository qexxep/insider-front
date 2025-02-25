'use client';

import { Suspense } from 'react';

import { Toaster } from '@/shared/ui';

import Loading from '../../../public/icons/loading.svg';

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
    <>
      {/* 헤더 */}
      {header}

      {/* 사이드바 */}
      {sidebar}

      {/* 메인 */}
      <div className="min-h-[calc(100vh - 48px)] ml-[260px] flex flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <main className="relative mx-auto max-w-[1200px] flex-1 flex-col p-5">{children}</main>
        </Suspense>

        {/* 푸터 */}
        {footer}
      </div>
      <Toaster />
    </>
  );
}

function LoadingSpinner() {
  return (
    <div className="-mt-12 flex min-h-screen flex-1 items-center justify-center">
      <Loading />
    </div>
  );
}
