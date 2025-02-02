import Link from 'next/link';
import { PropsWithChildren } from 'react';

import { cn } from '@/shared/lib';
import {
  Button,
  Icons,
  Separator,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Input,
} from '@/shared/ui';

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

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border/40 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full w-full items-center justify-between px-5">
        <div className="flex items-center gap-4">
          {/* 메인 로고 */}
          <Link href="/" className="flex items-center gap-1">
            <Icons.logo className="h-8 w-8" />
            <span className="text-xl font-bold text-[#FF4200]">INSIDER</span>
          </Link>
          {/* 실시간 검색어 */}
          <div className="flex min-w-[300px] items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden px-1 py-1">
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
            <Icons.arrowBigUp className="h-4 w-4 fill-[#FF4200] text-[#FF4200]" />
          </div>
          {/* 검색창 */}
          <div className="flex min-w-[500px] max-w-xl flex-1 px-4">
            <div className="relative w-full">
              <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF4200]" />
              <Input
                type="search"
                placeholder="검색어를 입력하세요."
                className="rounded-full border-[#FF4200] pl-10 focus:border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
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
            <Icons.bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF4200] text-[10px] text-white">
              0
            </span>
          </button>
          <button>
            <Icons.circleUser className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export const Sidebar = ({ className }: { className?: string }) => {
  const menuItems = {
    favorites: {
      title: '즐겨찾기 게시판',
      items: [
        { href: '/board/job', icon: <Icons.building2 className="h-4 w-4" />, label: '취업' },
        { href: '/board/love', icon: <Icons.heart className="h-4 w-4" />, label: '연애' },
      ],
    },
    inside: {
      title: '인사이드 게시판',
      items: [
        { href: '/board/economy', icon: <Icons.wallet className="h-4 w-4" />, label: '경제' },
        { href: '/board/politics', icon: <Icons.landPlot className="h-4 w-4" />, label: '정치' },
        { href: '/board/sports', icon: <Icons.dumbbell className="h-4 w-4" />, label: '스포츠' },
        { href: '/board/social', icon: <Icons.users className="h-4 w-4" />, label: '사회' },
        { href: '/board/entertainment', icon: <Icons.smile className="h-4 w-4" />, label: '익명 자유' },
      ],
    },
    healing: {
      title: '힐링추천',
      items: [
        { href: '/board/anonymous', icon: <Icons.helpCircle className="h-4 w-4" />, label: '익명고민' },
        { href: '/board/pets', icon: <Icons.dog className="h-4 w-4" />, label: '반려동물' },
        { href: '/board/free', icon: <Icons.handshake className="h-4 w-4" />, label: '무한위로' },
        { href: '/board/support', icon: <Icons.users className="h-4 w-4" />, label: '응원합시다' },
        { href: '/board/celebrity', icon: <Icons.diamond className="h-4 w-4" />, label: '명예의 전당' },
      ],
    },
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 h-screen w-[260px] border-r border-border bg-background px-6 py-4',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {/* 즐겨찾기 게시판 */}
      <MenuSection {...menuItems.favorites} />

      <Separator className="my-2" />

      {/* 인사이드 게시판 */}
      <MenuSection {...menuItems.inside} className="mt-4" />
      {/* 더보기 */}
      <Button
        variant="outline"
        className="-pb-4 w-full justify-start rounded-lg border-none px-1 py-2 text-sm font-semibold text-[#FF4200] hover:text-[#FF4200]"
      >
        <span>더보기</span>
      </Button>
      <Separator className="my-2" />

      {/* 힐링추천 */}
      <MenuSection {...menuItems.healing} className="mt-4" />
    </aside>
  );
};

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  className?: string;
}

const MenuSection = ({ title, items, className }: MenuSectionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className={className}>
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="rounded-lg px-1 py-2 hover:bg-accent/50 hover:no-underline">
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="space-y-1">
            {items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-1 py-2 text-sm hover:bg-accent"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
