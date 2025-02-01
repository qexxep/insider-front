import Link from 'next/link';
import { PropsWithChildren } from 'react';

import { cn } from '@/shared/lib';
import { buttonVariants, Icons } from '@/shared/ui';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-20 w-full items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-1">
              <Icons.logo className="h-15 w-15" />
              <span className="hidden text-[29px] font-black text-[#FF4200] sm:inline-block">INSIDER</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center gap-4">
              {/* 텍스트 링크 예시 */}
              <Link href="/posts" className="text-foreground transition-colors hover:text-foreground/80">
                투표하기
              </Link>
              {/* 아이콘 예시 */}
              <Link href={'#'} target="_blank" rel="noreferrer">
                <div
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                    }),
                    'w-9 px-0'
                  )}
                >
                  <Icons.gitHub className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 사이드바 */}
      <nav></nav>

      {/* 메인 */}
      <main className="flex-1">{children}</main>
    </>
  );
};
export default Layout;
