'use client';

import { Suspense } from 'react';

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
      <div className="ml-[260px] flex min-h-[calc(100vh-48px)] flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <main className="flex-1 p-5">{children}</main>
        </Suspense>

        {/* 푸터 */}
        {footer}
      </div>
    </>
  );
}

function LoadingSpinner() {
  return (
    <div className="-mt-12 ml-[260px] flex min-h-screen flex-1 items-center justify-center">
      <Loading />
    </div>
  );
}
