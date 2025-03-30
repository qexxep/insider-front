'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/entity/auth';
import { Badge, Button, Card, CardContent, CardHeader, Icons } from '@/shared/ui';
import { CardFooter } from '@/shared/ui/card';
import { postInvalidateQueries, useGetBestWorstPostInfo, useGetCategoryPostList, usePostReaction } from '@/views/posts';
import { Paginator } from '@/widgets/paginator';

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

interface Props {
  category: string;
}

export const CategoryPostList = ({ category }: Props) => {
  const router = useRouter();
  const { checkLogin } = useAuth();
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
  const { mutate: postReaction } = usePostReaction();

  if (isPostsLoading || isBestWorstLoading) {
    return null;
  }

  if (!relativePostListData || !bestWorstPostsData) {
    throw new Error('Post not found');
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

  const handlePostReaction = (
    reactionType: 'like' | 'unlike',
    actionType: 'add' | 'remove' | 'toggle',
    postId: string
  ) => {
    const isLoggedIn = checkLogin();
    if (!isLoggedIn) return;

    postReaction(
      { postSeq: postId, reactionType, actionType },
      {
        onSuccess: () => {
          postInvalidateQueries.list({
            categoryCd: category,
            currPage: currentPage,
            pageSize: DEFAULT_PAGE_SIZE,
            sortType,
          });
        },
        onError: error => {
          console.log(error);
        },
      }
    );
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
                  <span className="leading-[1] text-white">{bestWorstPosts.bestPostInfo.likeCnt}</span>
                  <button>
                    <Icons.thumbsDown className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#FF885F]/50 px-3 py-[7px]">
                  <Icons.comment className="h-4 w-4 text-white" />
                  <span className="leading-[1] text-white">{bestWorstPosts.bestPostInfo.commentCnt}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-bold">{bestWorstPosts.bestPostInfo.postTitle}</h3>
              <p className="line-clamp-1 font-normal">{bestWorstPosts.bestPostInfo.previewContent}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <Button
                className="w-full rounded-full bg-white font-bold text-primary"
                onClick={() => handlePostClick(bestWorstPosts.bestPostInfo.postSeq)}
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
                  <span className="leading-[1] text-white">{bestWorstPosts.worstPostInfo.likeCnt}</span>
                  <button>
                    <Icons.thumbsDown className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#8F8F8F]/50 px-3 py-[7px]">
                  <Icons.comment className="h-4 w-4 text-white" />
                  <span className="leading-[1] text-white">{bestWorstPosts.worstPostInfo.commentCnt}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-bold">{bestWorstPosts.worstPostInfo.postTitle}</h3>
              <p className="line-clamp-1 font-normal">{bestWorstPosts.worstPostInfo.previewContent}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full rounded-full bg-white font-bold text-gray-600"
                onClick={() => handlePostClick(bestWorstPosts.worstPostInfo.postSeq)}
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
        <div className="grid grid-cols-2 gap-4">
          {posts.map(post => (
            <Card
              key={post.postSeq}
              className="relative flex cursor-pointer flex-col justify-between bg-white p-6 pt-8 hover:bg-gray-100"
              onClick={() => handlePostClick(post.postSeq)}
            >
              <CardContent className="flex justify-between gap-4 p-0 pb-4">
                <div className="flex flex-col items-start gap-5">
                  <h4 className="font-bold text-gray-900">{post.postTitle}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Icons.inssiderType />
                      <span className="text-gray-900">{post.nickname}</span>
                    </div>
                    <div className="h-[11px] w-[1px] bg-[#D9D9D9] p-0" />
                    <div className="flex items-center gap-1 text-sm text-[#989898]">
                      <span>{post.regDate}</span>
                      <div className="h-[2px] w-[2px] rounded-full bg-[#D9D9D9] p-0" />
                      <span className="flex items-center gap-1">
                        <Icons.eye className="h-[18px] w-[18px]" />
                        {post.viewCnt}
                      </span>
                    </div>
                  </div>
                </div>
                {post.thumbnailPath && (
                  <div>
                    <Image
                      // TODO) 프론트엔드 환경에서 이미지 경로 처리
                      src={'http://inssider.kro.kr' + post.thumbnailPath}
                      alt={post.postTitle + 'thumbnail image'}
                      width={64}
                      height={64}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-[6px] gap-y-2 p-0">
                <div className="mr-2 flex items-center gap-3">
                  <div
                    className="flex items-center justify-center gap-2 rounded-full bg-[#dcdcdc]/50 px-3 py-[7px]"
                    onClick={e => e.stopPropagation()}
                  >
                    <button onClick={() => handlePostReaction('like', 'add', post.postSeq)}>
                      <Icons.thumbsUp className="h-4 w-4 text-gray-900" />
                    </button>
                    <span className="leading-[1] text-gray-900">{post.likeCnt}</span>
                    <button onClick={() => handlePostReaction('unlike', 'remove', post.postSeq)}>
                      <Icons.thumbsDown className="h-4 w-4 text-gray-900" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#dcdcdc]/50 px-3 py-[7px]">
                    <Icons.comment className="h-4 w-4 text-gray-900" />
                    <span className="leading-[1] text-gray-900">{post.commentCnt}</span>
                  </div>
                </div>
                {post.postTagList.map((tag: string, index: number) => (
                  <Badge key={`tag-${index}`} variant="tag">
                    #{tag}
                  </Badge>
                ))}
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
