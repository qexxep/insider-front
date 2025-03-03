import { Fragment } from 'react';

import { CategoryIcon } from '@/shared/components';
import { cn } from '@/shared/lib';
import { Separator } from '@/shared/ui';

import { CategoryItem, getCategories } from './api/category';
import { MenuSection } from './components/MenuSection';

export default async function Sidebar({ className }: { className?: string }) {
  const { data: categories } = await getCategories();

  // 즐겨찾기 더미 데이터
  const favoriteMenus = {
    majorCategoryNm: '즐겨찾기 게시판',
    categoryList: [
      { categoryCode: '003001', categoryName: '취업' },
      { categoryCode: '003002', categoryName: '연예' },
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
      {categories?.map(category => (
        <Fragment key={category.commCategoryCode}>
          <MenuSection title={category.majorCategoryName} categoryList={formatCategoryList(category.categoryList)} />
          <Separator className="my-2" />
        </Fragment>
      ))}
    </aside>
  );
}
