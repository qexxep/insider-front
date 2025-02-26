'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, useState } from 'react';

import { Toaster } from '@/shared/ui';

import Loading from '../../../public/icons/loading.svg';

function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // TO DO: 논의 후 수정 예정
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

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
    </AppProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="-mt-12 flex min-h-screen flex-1 items-center justify-center">
      <Loading />
    </div>
  );
}
