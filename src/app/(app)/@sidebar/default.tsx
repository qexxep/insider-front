'use client';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

import apiClient from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { cn } from '@/shared/lib';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Icons, Separator } from '@/shared/ui';

export default function Sidebar({ className }: { className?: string }) {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;

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
          icon: CategoryIcon({ categoryName: category.categoryName }),
          label: category.categoryName,
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
        }))}
      />
      <Separator className="my-2" />

      {categories?.categories?.map(category => (
        <React.Fragment key={category.majorCategoryNm}>
          <MenuSection title={category.majorCategoryNm} categoryList={category.categoryList} />
          <Separator className="my-2" />
        </React.Fragment>
      ))}
    </aside>
  );
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
    icon: CategoryIcon({ categoryName: category.categoryName }),
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
                prefetch={false}
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

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

export const iconMap: Record<string, keyof typeof Icons> = {
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
export function CategoryIcon({ categoryName, className = 'h-4 w-4' }: CategoryIconProps) {
  const IconComponent = Icons[iconMap[categoryName] ?? 'circle'];
  return <IconComponent className={className} />;
}

export interface CategoryItem {
  categoryCode: string;
  categoryName: string;
  href?: string;
  icon?: React.ReactNode;
  label?: string;
}

export interface CategoryGroup {
  categoryList: CategoryItem[];
  majorCategoryNm: string;
}

interface CategoriesResponse {
  categories: CategoryGroup[];
}

export const getCategories = async (): Promise<ApiResponse<CategoriesResponse>> => {
  return await apiClient.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mains/categories/all`).json();
};
export const useCategories = () => {
  const [categories, setCategories] = useState<CategoriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('카테고리 로딩 실패:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
