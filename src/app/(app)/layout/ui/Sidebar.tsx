import React from 'react';

import { cn } from '@/shared/lib';
import { Separator } from '@/shared/ui';

import { CategoryIcon } from '../components/CategoryIcon';
import { MenuSection } from '../components/MenuSection';
import { useCategories } from '../hooks/useCategories';

export function Sidebar({ className }: { className?: string }) {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;

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
        title={categories[0].majorCategoryNm}
        categoryList={categories[0].categoryList.map(category => ({
          href: `/board/${category.categoryCode.toLowerCase()}`,
          icon: <CategoryIcon categoryName={category.categoryName} />,
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
}
