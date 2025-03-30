import Image from 'next/image';
import { Fragment } from 'react';

import { cn } from '@/shared/lib';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui';

import { getCategoryRecentPosts } from '../api/category';
import { getRankings } from '../api/insider';
import { DISCUSSION_ITEMS, RANK_COLORS, RANK_ICONS } from '../consts';
import { CategoryPostCard } from './CategoryPostCard';
import { RankPostCard } from './RankPostCard';

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
                  className={cn(
                    'relative h-full rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg',
                    RANK_COLORS[item.rankNum as 1 | 2 | 3]
                  )}
                >
                  <CardHeader className="relative pb-0">
                    {item.rankNum <= 3 && (
                      <Image
                        src={RANK_ICONS[item.rankNum as 1 | 2 | 3].src}
                        className="h-13 w-13 absolute -top-1 right-0 z-20"
                        alt={RANK_ICONS[item.rankNum as 1 | 2 | 3].alt}
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
                        'mt-6 h-[30px] w-full rounded-3xl border-2 border-transparent bg-white text-sm text-primary-700',
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
      {recentPosts?.map(data => {
        // 현재 즐겨찾기 게시판이 title만 있고 카테고리가 없기에 임시 제외.
        if (data.categoryList.length === 0) {
          return null;
        }

        return (
          <Fragment key={data.commCategoryCode}>
            <h2 className="mb-4 mt-10 text-xl font-bold">{data.majorCategoryName}</h2>
            <div className="grid grid-cols-2 gap-5">
              {data.categoryList.map(category => (
                <CategoryPostCard key={category.categoryCode} data={category} />
              ))}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export { MainPage };
