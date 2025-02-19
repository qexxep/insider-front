import Image from 'next/image';
import React from 'react';

import { CategoryIcon } from '@/shared/components';
import { cn } from '@/shared/lib';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@/shared/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui';

import { getCategoryRecentPosts } from '../api/category';
import { getRankings } from '../api/insider';

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
  4: {
    src: '/icons/first.svg',
    alt: 'gold rank medal',
  },
  5: {
    src: '/icons/second.svg',
    alt: 'silver rank medal',
  },
  6: {
    src: '/icons/third.svg',
    alt: 'bronze rank medal',
  },
} as const;

export async function MainPage() {
  const RANK_COLORS = {
    1: 'bg-[#FC6423]',
    2: 'bg-[#FF7E3D]',
    3: 'bg-[#FFA375]',
    4: 'bg-[#FC6423]',
    5: 'bg-[#FF7E3D]',
    6: 'bg-[#FFA375]',
  } as const;

  const { data: rankings } = await getRankings();
  const { data: recentPosts } = await getCategoryRecentPosts();

  const DISCUSSION_ITEMS = [1, 2, 3, 4, 5, 6] as const;
  return (
    <div className="mx-auto w-full max-w-full px-6 lg:px-0">
      {/* 이번주 토론 주제 섹션 */}
      <h2 className="text-lg font-bold">이번주 토론 주제</h2>
      <p className="mb-4 mt-1 text-gray-600">
        이번주 토론 주제에 투표 참여해주세요! 금주 투표 결과에 따라 다음주 주제 선정에 반영됩니다.
      </p>

      <Carousel
        className="relative mb-10"
        opts={{
          slidesToScroll: 3,
          containScroll: 'trimSnaps',
          align: 'start',
          dragFree: false,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {' '}
          {DISCUSSION_ITEMS.map(num => (
            <CarouselItem key={num} className="pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3">
              <div className="p-1">
                <Card
                  className={`relative h-full rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg ${
                    RANK_COLORS[num as 1 | 2 | 3 | 4 | 5 | 6]
                  }`}
                >
                  <CardHeader className="relative pb-0">
                    {/* RankingLine을 순위별 아이콘으로 교체 */}
                    {(() => {
                      return (
                        <Image
                          src={RankIcons[num as 1 | 2 | 3 | 4 | 5 | 6].src}
                          className="absolute -top-1 right-0 z-20"
                          alt={RankIcons[num as 1 | 2 | 3 | 4 | 5 | 6].alt}
                          width={52}
                          height={52}
                          style={{ width: 'auto', height: 'auto' }}
                        />
                      );
                    })()}
                    <CardTitle className="text-sm font-medium text-white">법률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-md line-clamp-2 font-bold leading-7 text-white">
                      저조한 출산을 문제에 어떤 정책과 근본적인 문제는 무엇일까?
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-white">
                      &apos;현재 시행되고 있는 고등학교 및 중학교 교육체를 지속적으로 시행해야한다&apos;에 대한 찬반..
                    </p>
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
        <CarouselPrevious className="absolute -left-12 hidden h-12 w-12 items-center justify-center rounded-full border-none bg-transparent text-gray-400 transition-transform hover:scale-[1.02] hover:bg-transparent disabled:bg-transparent sm:flex">
          &lt;
        </CarouselPrevious>
        <CarouselNext className="absolute -right-12 hidden h-12 w-12 items-center justify-center rounded-full border-none bg-transparent text-gray-400 transition-transform hover:scale-[1.02] hover:bg-transparent disabled:bg-transparent sm:flex">
          &gt;
        </CarouselNext>
      </Carousel>

      {/* 인싸이더 랭킹 섹션 */}
      <h2 className="mb-2 text-xl font-bold">인싸이더 랭킹</h2>
      <div className="mb-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {rankings?.map(ranking => (
          <div key={ranking.postSeq} className="flex items-center gap-4 border-b border-[#d4d4d4] px-2 py-4">
            <span className="text-md w-6 self-start font-bold text-orange-500">{ranking.rankNum}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="rounded-sm bg-orange-100 px-1.5 py-0.5 text-sm font-medium text-orange-600">
                  {ranking.categoryName}
                </div>
                <div className="text-md truncate font-medium text-gray-900">{ranking.postTitle}</div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1 text-xs">
                  <Icons.clock className="h-4 w-4" />
                  {ranking.regDate}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Icons.eye className="h-4 w-4" />
                  {ranking.viewCnt}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Icons.thumbsUp className="h-4 w-4" />
                  {ranking.likeCnt}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-100 p-2">
              <span className="text-sm font-bold text-gray-600">{ranking.commentCnt}</span>
              <span className="text-xs text-gray-500">댓글</span>
            </div>
          </div>
        ))}
      </div>

      {recentPosts?.map(data => (
        <React.Fragment key={data.commCategoryCode}>
          <h2 className="mb-4 mt-10 text-xl font-bold">{data.majorCategoryName}</h2>
          <div className="grid grid-cols-2 gap-5">
            {data.categoryList.map(category => (
              <Card key={category.categoryCode}>
                <CardHeader className="flex flex-row items-center justify-between px-3 pb-0 pt-2">
                  <CardTitle className="text-md flex items-center gap-2 text-orange-500">
                    <CategoryIcon categoryName={category.categoryName} />
                    <span>{category.categoryName}</span>
                  </CardTitle>
                  <Button variant="ghost" className="!mt-0 h-5 justify-end p-2 !text-right text-sm text-gray-400">
                    더보기 &gt;
                  </Button>
                </CardHeader>
                <CardContent className="p-2 px-3">
                  <div className="space-y-1">
                    {category.recentPostList.map(post => (
                      <div key={post.postSeq} className="flex justify-between border-b py-2 last:border-0">
                        <span className="text-sm">{post.postTitle}</span>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Icons.thumbsUp className="h-4 w-4" />
                            {post.likeCnt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.messageSquare className="h-4 w-4" />
                            {post.commentCnt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
