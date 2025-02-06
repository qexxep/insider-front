'use client';

import { PropsWithChildren } from 'react';

import { Header, Sidebar } from './layout/index';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* 헤더 */}
      <Header />

      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 */}
      <main className="ml-[260px] flex-1 p-4">{children}</main>
    </>
  );
};
export default Layout;
