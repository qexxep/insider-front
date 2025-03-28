//import Image from 'next/image';
import { CookiesProvider } from 'next-client-cookies/server';
import { Suspense } from 'react';

//import { Suspense } from 'react';
import { LoginRequiredModal } from '@/entity/auth';
import { Toaster } from '@/shared/ui';

import AppProvider from './_provider';
import Loading from './loading';

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
      <CookiesProvider>
        {/* 헤더 */}
        {header}

        {/* 사이드바 */}
        {sidebar}

        {/* 메인 */}
        <div className="min-h-[calc(100vh - 48px)] relative ml-[260px] flex flex-col items-center">
          <Suspense fallback={<Loading />}>
            <main className="relative w-full max-w-[960px] flex-1 justify-center p-5">{children}</main>
          </Suspense>

          {/* 푸터 */}
          {footer}
        </div>
        <Toaster />
        <LoginRequiredModal />
      </CookiesProvider>
    </AppProvider>
  );
}
