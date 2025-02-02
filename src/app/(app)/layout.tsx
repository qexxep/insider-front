import Link from 'next/link';
import { PropsWithChildren } from 'react';

import { cn } from '@/shared/lib';
import { buttonVariants, Icons } from '@/shared/ui';
import { ArrowBigUp, Bell, CircleUser, Search, User } from 'lucide-react';
import { Separator } from '@/shared/ui/separator';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* 헤더 */}
      <Header />

      {/* 사이드바 */}
      <Sidebar className="fixed left-0 h-screen" />

      {/* 메인 */}
      <main className="flex-1">{children}</main>
    </>
  );
};
export default Layout;

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-5">
        <div className="flex items-center gap-4">
          {/* 메인 로고 */}
          <Link href="/" className="flex items-center gap-1">
            <Icons.logo className="h-8 w-8" />
            <span className="text-xl font-bold text-[#FF4200]">INSIDER</span>
          </Link>
          {/* 실시간 검색어 */}
          <div className="flex min-w-[300px] items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden px-3 py-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#FF4200]">HOT</span>
                <span className="text-sm font-medium text-gray-500">토픽</span>
              </div>
              <div className="relative h-7 overflow-hidden">
                <div
                  className="flex flex-col"
                  style={{
                    animation: 'smoothCarousel 30s steps(10, end) infinite',
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex h-7 items-center gap-2">
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-sm bg-gray-200 text-xs">
                        {i + 1}
                      </span>
                      <span className="whitespace-nowrap text-sm">실시간 검색어 {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ArrowBigUp className="h-4 w-4 fill-[#FF4200] text-[#FF4200]" />
          </div>
          {/* 검색창 */}
          <div className="flex min-w-[500px] max-w-xl flex-1 px-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF4200]" />
              <input
                type="search"
                placeholder="검색어를 입력하세요."
                className="w-full rounded-full border border-[#FF4200] bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff3300]"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/posts" className="text-sm font-medium">
            투표하기
          </Link>
          <Separator orientation="vertical" className="h-3" />
          <Link href="/posts" className="text-sm font-medium">
            글쓰기
          </Link>
          <Separator orientation="vertical" className="h-3" />
          <button className="relative mr-1">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF4200] text-[10px] text-white">
              0
            </span>
          </button>
          <button>
            <CircleUser className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export const Sidebar = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <aside
      className={cn(
        'w-[260px] border-r border-border bg-background p-2',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {children}
    </aside>
  );
};
