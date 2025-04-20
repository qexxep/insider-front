'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PersonalityIcon } from '@/feature/personality';
import { Button, Card, CardContent, CardHeader, Icons, LoadingSpinner } from '@/shared/ui';
import { CardFooter } from '@/shared/ui/card';
import { EmptyData } from '@/shared/ui/empty-data';
import { useGetBestWorstPostInfo, useGetCategoryPostList } from '@/views/posts';
import { Paginator } from '@/widgets/paginator';

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

interface Props {
  category: string;
}

export const CategoryPostList = ({ category }: Props) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [sortType, setSortType] = useState<'A' | 'D' | 'R'>('D');
  const sortTypeText = sortType === 'A' ? '등록순' : sortType === 'D' ? '최신순' : '추천순';

  const { data: relativePostListData, isLoading: isPostsLoading } = useGetCategoryPostList({
    categoryCd: category,
    currPage: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
    sortType,
  });
  const { data: bestWorstPostsData, isLoading: isBestWorstLoading } = useGetBestWorstPostInfo({
    categoryCd: category,
  });

  if (isPostsLoading || isBestWorstLoading) {
    return <LoadingSpinner />;
  }

  if (!relativePostListData || !bestWorstPostsData) {
    return (
      <EmptyData
        message="데이터를 찾을 수 없습니다."
        icon={<Icons.file className="h-12 w-12 text-gray-400" />}
        className="mx-auto max-w-[960px] py-[50px]"
      />
    );
  }

  const { posts, commonPosts, totalPostCnt, categoryName } = relativePostListData.data;
  const bestWorstPosts = bestWorstPostsData.data;

  const totalPages = Math.ceil(totalPostCnt / DEFAULT_PAGE_SIZE);

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${category}/${postId}`);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const changeSortType = () => {
    setSortType(prev => {
      if (prev === 'A') return 'D';
      if (prev === 'D') return 'R';
      return 'A';
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col justify-start py-[50px]">
      <div className="mb-[21px] flex items-center justify-between">
        <h1 className="w-full text-[28px] font-bold text-gray-900">{categoryName}</h1>
        <Link href={`/posts/write?category=${category}`}>
          <Button variant="default" size="sm" className="h-[46px] p-4 text-lg font-semibold [&_svg]:size-6">
            <Icons.pencil />
            글쓰기
          </Button>
        </Link>
      </div>
      {/* 필독 게시물 */}
      {Object.keys(commonPosts).length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">공지사항</h2>
          <div className="mb-6 flex flex-col gap-0 border-t-[1px] border-primary">
            <Link key={commonPosts.postSeq} href={`/posts/${category}/${commonPosts.postSeq}`}>
              <div className="flex items-center justify-between border-b-[1px] border-gray-300 bg-primary-200 px-6 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-4 text-white">필독</span>
                  <p className="text-lg">{commonPosts.postTitle}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
      {/* 베스트 워스트 게시물 */}
      {bestWorstPosts && (
        <div className="mb-10 flex gap-7">
          <Card className="flex w-full flex-col justify-between bg-primary-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-7">
              <span className="flex h-[30px] w-fit items-center justify-center gap-1 rounded-[4px] bg-[#FF885F] px-2">
                <Icons.thumbsUp className="h-4 w-4" />
                <span>BEST</span>
              </span>
              <div className="mr-2 flex items-center gap-3">
                <div className="flex h-[31px] items-center justify-center gap-2 rounded-full bg-[#FF885F]/50 px-3 py-[7px]">
                  <button>
                    <Icons.thumbsUp className="h-4 w-4 text-white" />
                  </button>
                  <span className="leading-[1] text-white">{bestWorstPosts?.bestPostInfo?.likeCnt}</span>
                  <button>
                    <Icons.thumbsDown className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#FF885F]/50 px-3 py-[7px]">
                  <Icons.comment className="h-4 w-4 text-white" />
                  <span className="leading-[1] text-white">{bestWorstPosts?.bestPostInfo?.commentCnt}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-bold">{bestWorstPosts?.bestPostInfo?.postTitle}</h3>
              <p className="line-clamp-1 font-normal">{bestWorstPosts?.bestPostInfo?.previewContent}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <Button
                className="w-full rounded-full bg-white font-bold text-primary"
                onClick={() => handlePostClick(bestWorstPosts?.bestPostInfo?.postSeq)}
              >
                베스트 게시물 보러가기
              </Button>
            </CardFooter>
          </Card>
          <Card className="white flex w-full flex-col justify-between bg-gray-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-7">
              <span className="flex h-[30px] w-fit items-center justify-center gap-1 rounded-[4px] bg-gray-500 px-2">
                <Icons.thumbsDown className="h-4 w-4" />
                <span>WORST</span>
              </span>
              <div className="mr-2 flex items-center gap-3">
                <div className="flex h-[31px] items-center justify-center gap-2 rounded-full bg-[#8F8F8F]/50 px-3 py-[7px]">
                  <button>
                    <Icons.thumbsUp className="h-4 w-4 text-white" />
                  </button>
                  <span className="leading-[1] text-white">{bestWorstPosts?.worstPostInfo?.likeCnt}</span>
                  <button>
                    <Icons.thumbsDown className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#8F8F8F]/50 px-3 py-[7px]">
                  <Icons.comment className="h-4 w-4 text-white" />
                  <span className="leading-[1] text-white">{bestWorstPosts?.worstPostInfo?.commentCnt}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-bold">{bestWorstPosts?.worstPostInfo?.postTitle}</h3>
              <p className="line-clamp-1 font-normal">{bestWorstPosts?.worstPostInfo?.previewContent}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full rounded-full bg-white font-bold text-gray-600"
                onClick={() => handlePostClick(bestWorstPosts?.worstPostInfo?.postSeq)}
              >
                워스트 게시물 보러가기
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      {/* 전체 게시물 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">전체 게시물</h2>
          <Button variant="ghost" className="h-fit px-3 py-2" onClick={changeSortType}>
            {sortTypeText}
            <Icons.arrowUpDown />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {posts?.map(post => (
            <Card
              key={post.postSeq}
              className="relative flex cursor-pointer flex-col justify-between bg-white p-6 pt-8 hover:bg-gray-100"
              onClick={() => handlePostClick(post.postSeq)}
            >
              <CardContent className="flex justify-between gap-4 p-0 pb-5">
                <div className="flex w-full flex-col items-start gap-3">
                  <h4 className="font-bold text-gray-900">{post.postTitle}</h4>
                  <div className="flex h-fit w-full flex-nowrap items-center gap-6">
                    <p className="line-clamp-3 h-fit w-full text-gray-900">{post.previewContent}</p>
                    {post.thumbnailPath && (
                      <div className="relative flex h-6 w-[64px] flex-shrink-0 items-center justify-center overflow-visible">
                        <Image
                          // TODO) 프론트엔드 환경에서 이미지 경로 처리
                          src={'http://inssider.kro.kr' + post.thumbnailPath}
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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0">
                      {post.postTagList.map((tag: string, index: number) => (
                        <span key={`tag-${index}`} className="text-xs text-gray-500">
                          #{tag}
                        </span>
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
              {/* TODO) 투표 중 상태 응답값 필요 */}
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
