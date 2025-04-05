import { cookies } from 'next/headers';
import Link from 'next/link';

import { type ApiResponse, baseApi } from '@/shared/api';
import { Icons, Input, Separator } from '@/shared/ui';

import UserProfile from './_components/UserProfile';
import { LinkButton } from './link-button';

export interface HotTopic {
  topicSeq: string;
  rankNum: string;
  searchWord: string;
  searchCnt: string;
}

async function getHotTopics(): Promise<ApiResponse<HotTopic[]>> {
  return baseApi.get('mains/hot-topic/rankings');
}

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  return (
    <header className="supports-[backdrop-filter]:bg-background/6 0 sticky top-0 z-50 h-14 w-full border-b border-border/40 bg-background/95 shadow-md backdrop-blur">
      <div className="flex h-full w-full items-center justify-between px-6">
        {/* 좌측 */}
        <div className="flex items-center gap-12 lg:gap-16">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-9 w-9 lg:h-10 lg:w-10" />
            <span className="text-lg font-extrabold text-primary lg:text-2xl">INSSIDER</span>
          </Link>
          <HotTopics />
        </div>
        {/* 중앙 */}
        <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/4 -translate-y-1/2 max-sm:w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[557px]">
          <div className="relative flex h-full w-full items-center">
            <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              type="search"
              placeholder="검색어를 입력하세요."
              className="h-10 w-full rounded-full border-primary pl-10 focus:border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        {/* 우측 */}
        {token && (
          <div className="flex items-center gap-3">
            <Link href="/posts" className="text-sm font-medium">
              투표하기
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <Link href="/posts/write" className="text-sm font-medium">
              글쓰기
            </Link>
            <Separator orientation="vertical" className="h-3" />
            <button className="relative mr-1">
              <Icons.bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                0
              </span>
            </button>
            <UserProfile />
          </div>
        )}
        {!token && (
          <div className="flex items-center gap-3">
            <LinkButton label="회원가입" href={'/signup'} />
            <Separator orientation="vertical" className="h-3" />
            <LinkButton label="로그인" href={'/login'} />
          </div>
        )}
      </div>
    </header>
  );
}

async function HotTopics() {
  const { data: topics } = await getHotTopics();

  return (
    <div className="flex min-w-[200px] items-center justify-between gap-3 overflow-hidden px-1 py-1 lg:min-w-[280px]">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-primary">HOT</span>
        <span className="text-sm font-medium text-gray-500">토픽</span>
      </div>
      <div className="relative h-7 flex-1 overflow-hidden">
        <ul
          className="flex flex-col transition-all duration-500"
          style={{
            animation: topics && topics.length >= 2 ? 'rollingAnimation 25s linear infinite' : 'none',
          }}
        >
          {topics && topics.length > 0
            ? [...topics, ...topics].map((topic, index) => (
                <li key={`${topic.topicSeq}-${index}`} className="relative flex h-7 items-center gap-2">
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-sm bg-gray-200 text-xs">
                    {topic.rankNum}
                  </span>
                  <span className="whitespace-nowrap text-sm">{topic.searchWord}</span>
                  <Icons.arrowBigUp className="absolute right-0 ml-5 h-4 w-4 justify-self-end fill-primary text-primary" />
                </li>
              ))
            : Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex h-7 items-center gap-2">
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-sm bg-gray-200 text-xs">
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap text-sm">로딩중...</span>
                </div>
              ))}
        </ul>
      </div>
    </div>
  );
}
