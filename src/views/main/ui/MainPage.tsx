import Image from 'next/image';
import React from 'react';

import { cn } from '@/shared/lib';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui';

import { getCategoryRecentPosts } from '../api/category';
import { getRankings } from '../api/insider';
import { CategoryPostCard } from './CategoryPostCard';
import { RankPostCard } from './RankPostCard';

const RankIcons = {
  1: {
    src: '/icons/first.svg',
    alt: 'gold rank medal',
  },
  2: {
    src: '/icons/second.svg',
    alt: 'silver rank medal',
  },
  3: {
    src: '/icons/third.svg',
    alt: 'bronze rank medal',
  },
} as const;
const RANK_COLORS = {
  1: 'bg-primary-600',
  2: 'bg-primary-500',
  3: 'bg-primary-400',
  4: 'bg-primary-600',
  5: 'bg-primary-500',
  6: 'bg-primary-400',
} as const;
const DISCUSSION_ITEMS = [
  {
    title: '저출산 문제 해결을 위한 효과적인 정책은 무엇일까?',
    content: '현재 시행되고 있는 출산 장려 정책의 실효성과 새로운 대안에 대한 논의를 시작해보세요.',
    categoryName: '법률',
    rankNum: 1,
  },
  {
    title: '금리 인상이 서민 경제에 미치는 영향',
    content: '최근 금리 인상으로 인한 가계 부채 증가와 경제적 영향에 대해 토론해보세요.',
    categoryName: '경제',
    rankNum: 2,
  },
  {
    title: 'AI 시대, 미래 직업 전망과 준비 방법',
    content: '인공지능 발전에 따른 일자리 변화와 새로운 직무 역량에 대해 이야기해보세요.',
    categoryName: '취업',
    rankNum: 3,
  },
  {
    title: '지방 분권화 정책의 장단점 분석',
    content: '수도권 집중 현상 해소를 위한 지방 분권화 정책의 실효성에 대해 논의해보세요.',
    categoryName: '정치',
    rankNum: 4,
  },
  {
    title: '2024 파리 올림픽 전망과 기대주',
    content: '다가오는 파리 올림픽에서 주목해야 할 종목과 선수들에 대해 이야기해보세요.',
    categoryName: '스포츠',
    rankNum: 5,
  },
  {
    title: '현대 연애와 데이팅 앱의 영향',
    content: '데이팅 앱의 보편화가 현대 연애 문화에 미치는 영향에 대해 토론해보세요.',
    categoryName: '연애',
    rankNum: 6,
  },
] as const;

async function MainPage() {
  const { data: rankings } = await getRankings();
  const { data: recentPosts } = await getCategoryRecentPosts();

  return (
    <div className="mx-auto w-full max-w-[868px] px-6 lg:px-0">
      {/* 이번주 토론 주제 섹션 */}
      <h2 className="text-lg font-bold">이번주 토론 주제</h2>
      <p className="mb-4 mt-1 text-gray-600">
        이번주 토론 주제에 투표 참여해주세요! 금주 투표 결과에 라 다음주 주제 선정에 반영됩니다.
      </p>

      <Carousel>
        <CarouselContent>
          {DISCUSSION_ITEMS.map(item => (
            <CarouselItem key={item.rankNum}>
              <div className="h-full p-1">
                <Card
                  className={`relative h-full rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg ${
                    RANK_COLORS[item.rankNum as 1 | 2 | 3 | 4 | 5 | 6]
                  }`}
                >
                  <CardHeader className="relative pb-0">
                    {item.rankNum <= 3 && (
                      <Image
                        src={RankIcons[item.rankNum as 1 | 2 | 3].src}
                        className="h-13 w-13 absolute -top-1 right-0 z-20"
                        alt={RankIcons[item.rankNum as 1 | 2 | 3].alt}
                        width={52}
                        height={52}
                      />
                    )}
                    <CardTitle className="text-sm font-medium text-white">{item.categoryName}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-md line-clamp-2 h-[56px] font-bold leading-7 text-white">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-white">{item.content}</p>
                    <Button
                      variant="default"
                      className={cn(
                        'mt-6 h-[30px] w-full rounded-3xl border-2 border-transparent bg-white text-sm text-[#ff4200]',
                        'transition-all duration-300',
                        'shadow-[0_4px_12px_-2px_rgba(0,0,0,0.2)]',
                        'hover:border-white hover:bg-white/10',
                        'hover:text-white hover:backdrop-blur-sm',
                        'hover:shadow-[0_6px_16px_-2px_rgba(255,255,255,0.3)]',
                        'active:scale-[0.98] active:transform'
                      )}
                    >
                      토론 페이지로 이동하기
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious>&lt;</CarouselPrevious>
        <CarouselNext>&gt;</CarouselNext>
      </Carousel>

      {/* 인싸이더 랭킹 섹션 */}
      <h2 className="mb-2 text-xl font-bold">인싸이더 랭킹</h2>
      <div className="mb-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {rankings?.map(item => <RankPostCard key={item.postSeq} data={item} />)}
      </div>

      {/* 게시판 / 카테고리별 최신 포스트 섹션 */}
      {recentPosts?.map(data => (
        <React.Fragment key={data.commCategoryCode}>
          <h2 className="mb-4 mt-10 text-xl font-bold">{data.majorCategoryName}</h2>
          <div className="grid grid-cols-2 gap-5">
            {data.categoryList.map(category => (
              <CategoryPostCard key={category.categoryCode} data={category} />
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export { MainPage };
