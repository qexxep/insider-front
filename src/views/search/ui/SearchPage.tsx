'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { PersonalityIcon } from '@/feature/personality';
import { CategoryIcon } from '@/shared/components';
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icons,
  LoadingSpinner,
} from '@/shared/ui';
import { CardFooter } from '@/shared/ui/card';
import { EmptyData } from '@/shared/ui/empty-data';
import { Paginator } from '@/widgets/paginator';

import { useSearchQuery } from '../api/queries';
import { Post } from '../api/types';

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [sortType, setSortType] = useState<'A' | 'D' | 'R'>('D');
  const sortTypeText = sortType === 'A' ? '등록순' : sortType === 'D' ? '최신순' : '인기순';

  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchQuery(
    {
      keyword: query,
      sortType,
      currPage: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    },
    !!query
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyData
        message="검색 중 오류가 발생했습니다. 다시 시도해주세요."
        icon={<Icons.alertTriangle className="h-12 w-12 text-gray-400" />}
        className="mx-auto max-w-[960px] py-[50px]"
      />
    );
  }

  if (!searchResults && query) {
    return (
      <EmptyData
        message="검색 결과를 찾을 수 없습니다."
        icon={<Icons.file className="h-12 w-12 text-gray-400" />}
        className="mx-auto max-w-[960px] py-[50px]"
      />
    );
  }

  if (!query) {
    return (
      <EmptyData
        message="검색어를 입력해주세요."
        icon={<Icons.search className="h-12 w-12 text-gray-400" />}
        className="mx-auto max-w-[960px] py-[50px]"
      />
    );
  }

  const totalPages = Math.ceil((searchResults?.totalCount || 0) / DEFAULT_PAGE_SIZE);

  const handlePostClick = (postId: string) => {
    router.push(`/posts/detail/${postId}`);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const highlightText = (str: string) => {
    if (!query) return str;
    // 태그라면 #을 붙여서 검색어와 비교
    const tagPattern = new RegExp(`#${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
    // 일반 텍스트는 기존 방식
    const normalPattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    // 태그(#검색어)라면 #까지 포함해서 하이라이트, 아니면 기존 방식
    if (str.startsWith('#')) {
      return str.replace(tagPattern, match => `<b class="text-primary">${match}</b>`);
    }
    return str.replace(normalPattern, match => `<b class="text-primary">${match}</b>`);
  };

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col justify-start py-[50px]">
      <div className="mb-[21px] flex items-center justify-between">
        <h1 className="w-full text-[24px] text-gray-900">
          <span className="font-bold">&#039;{query}&#039; </span>
          <span className="font-medium">검색 결과</span>
        </h1>
      </div>

      {/* 전체 검색 결과 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-[#242424]">전체 검색 결과 {searchResults?.totalCount || 0} 건</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-fit items-center gap-1 px-3 py-2" aria-label="정렬 방식 선택">
                <span className={sortType === 'D' ? 'font-bold' : ''}>{sortTypeText}</span>
                <Icons.chevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem
                onClick={() => setSortType('D')}
                className={sortType === 'D' ? 'font-bold text-primary' : ''}
              >
                최신순
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortType('A')}
                className={sortType === 'A' ? 'font-bold text-primary' : ''}
              >
                등록순
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortType('R')}
                className={sortType === 'R' ? 'font-bold text-primary' : ''}
              >
                인기순
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {(searchResults?.totalCount || 0) > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {searchResults?.result &&
              searchResults.result.map((post: Post) => (
                <Card
                  key={post.postSeq}
                  className="relative flex cursor-pointer flex-col justify-between bg-white p-6 pt-8 hover:bg-gray-100"
                  onClick={() => handlePostClick(post.postSeq)}
                >
                  <CardContent className="flex justify-between gap-4 p-0">
                    <div className="flex w-full flex-col items-start gap-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CategoryIcon categoryName={post.categoryName} />
                        <span>{post.categoryName}</span>
                      </div>
                      <h4
                        className="text-lg font-bold text-gray-900"
                        dangerouslySetInnerHTML={{ __html: highlightText(post.postTitle) }}
                      />
                      <div className="flex h-fit w-full flex-nowrap items-center gap-6 pb-4">
                        <p className="line-clamp-3 h-fit w-full text-base text-gray-900">{post.previewContent}</p>
                        {post.thumbnailPath && (
                          <div className="relative flex h-6 w-[64px] flex-shrink-0 items-center justify-center overflow-visible">
                            <Image
                              src={post.thumbnailPath}
                              alt={post.postTitle + 'thumbnail image'}
                              width={64}
                              height={64}
                              style={{ width: '64px', height: '64px' }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      {post.postTagList.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0 pb-3">
                          {post.postTagList.map((tag: string, index: number) => (
                            <span
                              key={`tag-${index}`}
                              className="text-xs text-gray-500"
                              dangerouslySetInnerHTML={{ __html: highlightText(`#${tag}`) }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-nowrap justify-between gap-[6px] gap-y-2 p-0">
                    <div className="mr-2 flex items-center gap-2">
                      <div className="border-gray-500/50 flex items-center justify-center gap-2 rounded-full border px-3 py-[7px]">
                        <Icons.thumbsUp className="h-4 w-4 text-gray-900" />
                        <span className="text-sm leading-[1] text-gray-900">{post.likeCnt}</span>
                        <Icons.thumbsDown className="h-4 w-4 text-gray-900" />
                      </div>
                      <div className="border-gray-500/50 flex items-center justify-center gap-2 rounded-full border px-3 py-[7px]">
                        <Icons.comment className="h-4 w-4 text-gray-900" />
                        <span className="text-sm leading-[1] text-gray-900">{post.commentCnt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <PersonalityIcon code={'CIEM'} size={16} />
                        <span className="w-fit max-w-[76px] truncate text-ellipsis text-[13px] text-gray-900">
                          {post.nickname}
                        </span>
                      </div>
                      <div className="h-[11px] w-[1px] bg-[#D9D9D9] p-0" />
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Icons.eye className="h-[18px] w-[18px]" />
                          {post.viewCnt}
                        </span>
                        <div className="h-[11px] w-[1px] bg-[#D9D9D9] p-0" />
                        <span className="truncate text-ellipsis">{post.regDate}</span>
                      </div>
                    </div>
                  </CardFooter>
                  {post.isVote !== 0 && (
                    <div className="absolute -left-1 -top-[1px] flex items-center justify-center gap-[2px] overflow-y-visible rounded-[2px] rounded-bl-none bg-primary px-[6px] py-1 text-xs text-white">
                      <Icons.trashChecked />
                      투표 중
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="3"
                        height="4"
                        viewBox="0 0 3 4"
                        fill="none"
                        className="absolute -bottom-[3.5px] left-0 h-[3.5px] w-[3px]"
                      >
                        <path d="M3 3.5V0H0L3 3.5Z" fill="#942600" />
                      </svg>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        ) : (
          <EmptyData
            message="검색 결과를 찾을 수 없습니다."
            icon={<Icons.file className="h-12 w-12 text-gray-400" />}
            className="mx-auto max-w-[960px] py-[50px]"
          />
        )}
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showPreviousNext={true}
        />
      </div>
    </div>
  );
};
