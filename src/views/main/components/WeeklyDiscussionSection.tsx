import Image from 'next/image';
import React from 'react';

import { cn } from '@/shared/lib';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui';

// Weekly Discussion Section Component
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
export function WeeklyDiscussionSection({ discussionItems }: { discussionItems: number[] }) {
  const RANK_COLORS = {
    1: 'bg-[#FC6423]',
    2: 'bg-[#FF7E3D]',
    3: 'bg-[#FFA375]',
    4: 'bg-[#FC6423]',
    5: 'bg-[#FF7E3D]',
    6: 'bg-[#FFA375]',
  } as const;

  return (
    <React.Fragment>
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
          {discussionItems.map(num => (
            <CarouselItem key={num} className="pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3">
              <div className="p-1">
                <Card
                  className={`relative h-full rounded-lg transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg ${
                    RANK_COLORS[num as 1 | 2 | 3 | 4 | 5 | 6]
                  }`}
                >
                  <CardHeader className="relative pb-0">
                    {/* RankingLine을 순위별 아이콘으로 교체 */}
                    <Image
                      src={RankIcons[num as 1 | 2 | 3 | 4 | 5 | 6].src}
                      className="h-13 w-13 absolute -top-1 right-0 z-20"
                      alt={RankIcons[num as 1 | 2 | 3 | 4 | 5 | 6].alt}
                      width={52}
                      height={52}
                    />
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
    </React.Fragment>
  );
}
