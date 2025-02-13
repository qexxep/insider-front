import { CategoryIcon } from '@/shared/components';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@/shared/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui';

import RankingLine from '../../../../public/icons/card_line.svg';
import First from '../../../../public/icons/first.svg';
import Second from '../../../../public/icons/second.svg';
import Third from '../../../../public/icons/third.svg';

const RankIcons = {
  RankingLine,
  1: First,
  2: Second,
  3: Third,
} as const;

function MainPage() {
  const RANK_COLORS = {
    1: 'bg-orange-600/80',
    2: 'bg-orange-600/60',
    3: 'bg-orange-600/40',
  } as const;

  const DISCUSSION_ITEMS = [1, 2, 3];
  const INSIDER_ITEMS = Array.from({ length: 10 }, (_, i) => i);
  const CATEGORIES = ['취업', '연애', '경제', '정치', '스포츠', '사회', '익명자유'] as const;
  const CATEGORY_ITEMS = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="mx-auto w-[900px] max-w-full px-6 lg:px-0 [&>*]:min-w-[900px]">
      {/* 이번주 토론 주제 섹션 */}
      <h2 className="text-lg font-bold">이번주 토론 주제</h2>
      <p className="mb-4 mt-1 text-gray-600">
        이번주 토론 주제에 투표 참여해주세요! 금주 투표 결과에 따라 다음주 주제 선정에 반영됩니다.
      </p>

      <Carousel className="mb-10">
        <CarouselContent className="-ml-2 -mr-2 overflow-visible">
          {DISCUSSION_ITEMS.map(num => (
            <CarouselItem
              key={num}
              className="pl-2 pr-2 transition-all duration-300 ease-in-out hover:-translate-y-1 sm:basis-1/2 lg:basis-1/3"
            >
              <Card
                className={`relative h-full rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md ${
                  RANK_COLORS[num as 1 | 2 | 3]
                }`}
              >
                <CardHeader className="relative">
                  {/* RankingLine을 순위별 아이콘으로 교체 */}
                  {(() => {
                    const Icon = RankIcons[num as 1 | 2 | 3];
                    return <Icon className="absolute right-0 top-1 z-20 h-10 w-10" />;
                  })()}
                  <RankIcons.RankingLine
                    className={`absolute -top-1.5 right-0 z-10 ${num === 1 ? '' : 'fill-[#D9D9D9]'}`}
                  />
                  <CardTitle className="text-sm text-white">법률</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-md line-clamp-2 font-bold text-white">
                    지조한 출산을 문제에 어떤 정책과 근본적인 문제는 무엇일까?
                  </p>
                  <p className="line-clamp-2 text-xs text-white">
                    &apos;현재 시행되고 있는 고등학교 및 중학교 교육체를 지속적으로 시행해야한다&apos;에 대한 찬반..
                  </p>
                  <Button
                    variant="default"
                    className="w-full rounded-2xl bg-white text-orange-600 transition-colors hover:bg-gray-100"
                  >
                    토론 페이지로 이동하기
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden h-10 w-10 items-center justify-center rounded-full border-none text-gray-400 disabled:bg-transparent sm:flex">
          &lt;
        </CarouselPrevious>
        <CarouselNext className="hidden h-10 w-10 items-center justify-center rounded-full border-none text-gray-400 disabled:bg-transparent sm:flex">
          &gt;
        </CarouselNext>
      </Carousel>

      {/* 인사이더 랭킹 섹션 */}
      <h2 className="mb-6 text-xl font-bold">인사이더 랭킹</h2>
      <div className="mb-10 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {INSIDER_ITEMS.map(i => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
            <span className="self-start text-xl font-bold text-orange-500">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="rounded-sm bg-orange-100 px-1.5 py-0.5 text-sm font-medium text-orange-600">취업</div>
                <div className="truncate text-gray-900">본사의 감작스런 해고통보</div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Icons.clock className="h-4 w-4" />
                  9시간 전
                </span>
                <span className="flex items-center gap-1">
                  <Icons.eye className="h-4 w-4" />
                  231
                </span>
                <span className="flex items-center gap-1">
                  <Icons.thumbsUp className="h-4 w-4" />
                  90
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-100 p-2">
              <span className="text-md font-bold text-gray-600">37</span>
              <span className="text-sm text-gray-500">댓글</span>
            </div>
          </div>
        ))}
      </div>

      {/* 토론 게시판 섹션 */}
      <h2 className="mb-6 text-xl font-bold">토론 게시판</h2>
      <div className="grid grid-cols-2 gap-6">
        {CATEGORIES.map(category => (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <CategoryIcon categoryName={category} />
                <span>{category}</span>
              </CardTitle>
              <Button variant="ghost" className="text-sm text-gray-400">
                더보기 &gt;
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CATEGORY_ITEMS.map(i => (
                  <div key={i} className="flex justify-between border-b py-2 last:border-0">
                    <span className="text-sm">형님들 퇴사사유 두개 중 조언 부탁드립니다.</span>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icons.thumbsUp className="h-4 w-4" />
                        86
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.messageSquare className="h-4 w-4" />
                        86
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 힐링추천 섹션 */}
      <h2 className="mb-6 mt-10 text-xl font-bold">힐링추천</h2>
      <div className="grid grid-cols-2 gap-6">
        {['익명고민', '반려동물', '무한위로', '응원합시다'].map(category => (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <CategoryIcon categoryName={category} />
                <span>{category}</span>
              </CardTitle>
              <Button variant="ghost" className="text-sm text-gray-400">
                더보기 &gt;
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CATEGORY_ITEMS.map(i => (
                  <div key={i} className="flex justify-between border-b py-2 last:border-0">
                    <span className="text-sm">형님들 퇴사사유 두개 중 조언 부탁드립니다.</span>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icons.thumbsUp className="h-4 w-4" />
                        86
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.messageSquare className="h-4 w-4" />
                        86
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { MainPage };
