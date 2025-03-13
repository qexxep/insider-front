import { Fragment } from 'react';

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
      { categoryCode: '003002', categoryName: '연애' },
    ],
  };

  // 즐겨찾기 카테고리 코드 Set 생성
  const favoriteCategoryCodes = new Set(favoriteMenus.categoryList.map(cat => cat.categoryCode));

  const formatCategoryList = (categoryList: CategoryItem[], excludeFavorites = false) =>
    categoryList
      // 즐겨찾기 제외 옵션이 true인 경우, 즐겨찾기에 없는 카테고리만 필터링
      // TO DO: 즐겨찾기 API 추가 시 수정 예정
      .filter(category => !excludeFavorites || !favoriteCategoryCodes.has(category.categoryCode))
      .map(category => ({
        href: `/posts/${category.categoryCode.toLowerCase()}`,
        // icon을 미리 생성하지 않고 categoryName만 전달
        categoryName: category.categoryName,
        label: category.categoryName,
        categoryCode: category.categoryCode,
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

      {/* 카테고리 메뉴 - 즐겨찾기 항목 제외 */}
      {categories?.map(category => {
        // 현재 즐겨찾기 게시판이 title만 있고 카테고리가 없기에 임시 제외.
        if (category.categoryList.length === 0) {
          return null;
        }

        return (
          <Fragment key={category.commCategoryCode}>
            <MenuSection
              title={category.majorCategoryName}
            categoryList={formatCategoryList(category.categoryList, true)}
          />
          <Separator className="my-2" />
        </Fragment>
    )})}
    </aside>
  );
}
