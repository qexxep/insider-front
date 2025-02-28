import React from 'react';

import { apiClient, type ApiResponse } from '@/shared/api';
import { CategoryIcon } from '@/shared/components';
import { cn } from '@/shared/lib';
import { Separator } from '@/shared/ui';

import { MenuSection } from './components/MenuSection';

// Types
interface CategoryItem {
  categoryCode: string;
  categoryName: string;
  href?: string;
  icon?: React.ReactNode;
  label?: string;
}

interface CategoryGroup {
  majorCategoryName: string;
  commCategoryCode: string;
  categoryList: CategoryItem[];
}

// API Functions
async function getCategories(): Promise<ApiResponse<CategoryGroup[]>> {
  return await apiClient.get('mains/categories/all').json();
}

// Main Sidebar Component
export default async function Sidebar({ className }: { className?: string }) {
  const { data } = await getCategories();

  // 즐겨찾기 더미 데이터
  const favoriteMenus = {
    majorCategoryNm: '즐겨찾기 게시판',
    categoryList: [
      { categoryCode: 'job', categoryName: '취업' },
      { categoryCode: 'love', categoryName: '연애' },
    ],
  };

  const formatCategoryList = (categoryList: CategoryItem[]) =>
    categoryList.map(category => ({
      href: `/posts/${category.categoryCode.toLowerCase()}`,
      icon: CategoryIcon({ categoryName: category.categoryName }),
      label: category.categoryName,
      categoryCode: category.categoryCode,
      categoryName: category.categoryName,
    }));
  return (
    <aside
      className={cn(
        'fixed left-0 top-14 h-screen w-[260px] border-r border-border bg-background px-6 py-4',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {/* 즐겨찾기 메뉴 */}
      <MenuSection
        title={favoriteMenus.majorCategoryNm}
        categoryList={formatCategoryList(favoriteMenus.categoryList)}
      />
      <Separator className="my-2" />

      {/* 카테고리 메뉴 */}
      {(data as CategoryGroup[])?.map(category => (
        <React.Fragment key={category.commCategoryCode}>
          <MenuSection title={category.majorCategoryName} categoryList={formatCategoryList(category.categoryList)} />
          <Separator className="my-2" />
        </React.Fragment>
      ))}
    </aside>
  );
}
