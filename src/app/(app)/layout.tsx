'use client';

import { PropsWithChildren } from 'react';

import { Header, Sidebar } from './layout/index';

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
  const [hotTopics, setHotTopics] = useState<
    Array<{
      topicSeq: string;
      rankNum: string;
      searchWord: string;
      searchCnt: string;
    }>
  >([]);

  useEffect(() => {
    const fetchHotTopics = async () => {
      try {
        const response = await ky.get(`/api/mains/hot-topic/rankings`).json<{
          status: string;
          message: string;
          data: Array<{
            topicSeq: string;
            rankNum: string;
            searchWord: string;
            searchCnt: string;
          }>;
        }>();
        setHotTopics(response.data);
      } catch (error) {
        console.error('핫토픽 로딩 실패:', error);
      }
    };

    fetchHotTopics();
  }, []);

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border/40 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full w-full items-center justify-between px-6">
        <div className="flex flex-1 items-center gap-24">
          {/* 메인 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-11 w-11" />
            <span className="text-2xl font-extrabold text-[#FF4200]">INSIDER</span>
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
                    animation: hotTopics.length >= 2 ? 'smoothCarousel 30s steps(10, end) infinite' : 'none',
                  }}
                >
                  {/* 핫토픽 애니메이션은 데이터가 2개 이상일 때만 적용 */}
                  {hotTopics.length > 0
                    ? [...hotTopics, ...hotTopics].slice(0, 10).map((topic, index) => (
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

{
  /* 아이콘 매핑 함수: figma의 asset으로 관리할지 여부에 따라 변경 가능성 O */
}
const iconMap: Record<string, keyof typeof Icons> = {
  취업: 'building2',
  연애: 'heart',
  연예: 'smile',
  경제: 'wallet',
  정치: 'landPlot',
  스포츠: 'dumbbell',
  사회: 'users',
  익명자유: 'smile',
  익명고민: 'helpCircle',
  반려동물: 'dog',
  무한위로: 'handshake',
  응원합시다: 'users',
};

const getIconForCategory = (categoryName: string) => {
  const IconComponent = Icons[iconMap[categoryName] ?? 'circle'];
  return <IconComponent className="h-4 w-4" />;
};

export const Sidebar = ({ className }: { className?: string }) => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  {
    /* 즐겨찾기 더미 데이터: 추후 API 연동 후 삭제 요망 */
  }
  const favoriteMenus = {
    majorCategoryNm: '즐겨찾기 게시판',
    categoryList: [
      { categoryCode: 'job', categoryName: '취업' },
      { categoryCode: 'love', categoryName: '연애' },
    ],
  };

  {
    /* 게시판 목록 조회 */
  }
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ky.get(`/api/mains/categories/all`).json<CategoryResponse>();
        setCategories(response.data.categories);
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>로딩중...</div>;
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 h-screen w-[260px] border-r border-border bg-background px-6 py-4',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {/* 즐겨찾기 메뉴: 추후 API 연동 요망*/}
      <MenuSection
        title={favoriteMenus.majorCategoryNm}
        categoryList={favoriteMenus.categoryList.map(category => ({
          href: `/board/${category.categoryCode.toLowerCase()}`,
          icon: getIconForCategory(category.categoryName),
          label: category.categoryName,
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
        }))}
      />
      <Separator className="my-2" />

      {categories.map(category => (
        <React.Fragment key={category.majorCategoryNm}>
          <MenuSection title={category.majorCategoryNm} categoryList={category.categoryList} />
          <Separator className="my-2" />
        </React.Fragment>
      ))}
    </aside>
  );
};

interface CategoryItem {
  categoryCode: string;
  categoryName: string;
  href?: string;
  icon?: React.ReactNode;
  label?: string;
}

interface CategoryGroup {
  categoryList: CategoryItem[];
  majorCategoryNm: string;
}

interface CategoryResponse {
  status: string;
  message: string;
  data: {
    categories: CategoryGroup[];
  };
}

interface MenuSectionProps {
  title: string;
  categoryList: CategoryItem[];
  className?: string;
}

const MenuSection = ({ title, categoryList, className }: MenuSectionProps) => {
  const [showAll, setShowAll] = useState(false);

  const displayItems = categoryList.map(category => ({
    href: `/board/${category.categoryCode.toLowerCase()}`,
    icon: getIconForCategory(category.categoryName),
    label: category.categoryName,
  }));

  const INITIAL_DISPLAY_COUNT = 5;

  const visibleItems = useMemo(
    () => (showAll ? displayItems : displayItems.slice(0, INITIAL_DISPLAY_COUNT)),
    [showAll, displayItems]
  );

  return (
    <Accordion type="single" collapsible defaultValue="item-1" className={className}>
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="rounded-lg px-1 py-2 hover:bg-accent/50 hover:no-underline">
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="space-y-1">
            {visibleItems.map(item => (
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
          {displayItems.length > INITIAL_DISPLAY_COUNT && (
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg border-none px-1 py-2 text-sm font-semibold text-[#FF4200] hover:text-[#FF4200]"
              onClick={() => setShowAll(!showAll)}
            >
              <span>{showAll ? '접기' : '더보기'}</span>
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
