import Link from 'next/link';

import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { Icons, Input, Separator } from '@/shared/ui';

// Types
export interface HotTopic {
  topicSeq: string;
  rankNum: string;
  searchWord: string;
  searchCnt: string;
}

// API Functions
async function getHotTopics(): Promise<ApiResponse<HotTopic[]>> {
  return apiClient.get('mains/hot-topic/rankings').json();
}

// Main Header Component
export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border/40 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full w-full items-center justify-between px-6">
        <LeftSection />
        <SearchSection />
        <RightSection />
      </div>
    </header>
  );
}

// Left Section Components
async function LeftSection() {
  return (
    <div className="flex items-center gap-24">
      <LogoLink />
      <HotTopics />
    </div>
  );
}

function LogoLink() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Icons.logo className="h-11 w-11" />
      <span className="text-2xl font-extrabold text-[#FF4200]">INSIDER</span>
    </Link>
  );
}

async function HotTopics() {
  const { data: topics } = await getHotTopics();

  return (
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
              animation: topics && topics.length >= 2 ? 'smoothCarousel 30s steps(10, end) infinite' : 'none',
            }}
          >
            {topics && topics.length > 0
              ? [...topics, ...topics].slice(0, 10).map((topic, index) => (
                  <div key={`${topic.topicSeq}-${index}`} className="flex h-7 items-center gap-2">
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-sm bg-gray-200 text-xs">
                      {topic.rankNum}
                    </span>
                    <span className="whitespace-nowrap text-sm">{topic.searchWord}</span>
                  </div>
                ))
              : Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex h-7 items-center gap-2">
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-sm bg-gray-200 text-xs">
                      {i + 1}
                    </span>
                    <span className="whitespace-nowrap text-sm">로딩중...</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <Icons.arrowBigUp className="h-4 w-4 fill-[#FF4200] text-[#FF4200]" />
    </div>
  );
}

// Search Section Component
function SearchSection() {
  return (
    <div className="flex max-h-[40px] max-w-xl flex-1 items-center justify-center px-4">
      <div className="relative flex h-full max-h-[40px] w-full items-center">
        <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF4200]" />
        <Input
          type="search"
          placeholder="검색어를 입력하세요."
          className="h-10 rounded-full border-[#FF4200] pl-10 focus:border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

// Right Section Components
function RightSection() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/posts" className="text-sm font-medium">
        투표하기
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <Link href="/posts" className="text-sm font-medium">
        글쓰기
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <NotificationButton />
      <UserButton />
    </div>
  );
}

function NotificationButton() {
  return (
    <button className="relative mr-1">
      <Icons.bell className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF4200] text-[10px] text-white">
        0
      </span>
    </button>
  );
}

function UserButton() {
  return (
    <button>
      <Icons.circleUser className="h-5 w-5" />
    </button>
  );
}
