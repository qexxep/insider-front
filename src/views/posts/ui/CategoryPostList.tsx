'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge, Button, Card, CardContent, CardHeader, Icons } from '@/shared/ui';
import { CardFooter } from '@/shared/ui/card';
import { Paginator } from '@/widgets/paginator';

import { BestWorstPostInfoResponse, PostListResponse } from '../api/types';

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

interface Props {
  category: string;
  bestWorstPosts: BestWorstPostInfoResponse;
  postList: PostListResponse;
}

export const CategoryPostList = ({ category, bestWorstPosts, postList }: Props) => {
  const { categoryName, posts, totalPostCnt } = postList;
  const router = useRouter();

  // TODO) React Query 연동
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const totalPages = Math.ceil(totalPostCnt / DEFAULT_PAGE_SIZE);

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${category}/${postId}`);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 태그 파싱 헬퍼 함수 추가
  const parsePostTags = (tagString?: string): string[] => {
    if (!tagString) return [];
    // '#' 으로 시작하는 태그들을 분리하고, 빈 문자열 제거
    return tagString.split('#').filter(Boolean);
  };

  return (
    <div className="flex w-full max-w-[1200px] flex-col justify-start py-[50px]">
      <h1 className="mb-5 w-full text-[28px] font-bold text-gray-700">{categoryName}</h1>
      {/* 필독 게시물 */}
      <div className="mb-6 flex items-center justify-between bg-primary-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary px-4 text-white">필독</span>
          <p className="text-lg">윤대통령, 기시다 후미오 일본 총리 12번째 회담</p>
        </div>
      </div>
      {/* 베스트 워스트 게시물 */}
      {bestWorstPosts && (
        <div className="mb-10 flex gap-7">
          <Card className="flex w-full flex-col justify-between bg-[#FC6423] text-white">
            <CardHeader className="pb-3 pt-7">
              <span className="flex w-fit items-center justify-center gap-1 rounded-[4px] bg-[#FF885F] p-2">
                <Icons.thumbsUp className="h-4 w-4" />
                <span>BEST</span>
              </span>
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
            <CardHeader className="pb-3 pt-7">
              <span className="flex w-fit items-center justify-center gap-1 rounded-[4px] bg-gray-500 p-2">
                <Icons.thumbsDown className="h-4 w-4" />
                <span>WORST</span>
              </span>
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
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">전체 게시물</h2>
          <Button variant="ghost" className="px-3">
            최신순
            <Icons.arrowUpDown />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {posts.map(post => (
            <Card key={post.postSeq} className="cursor-pointer p-6" onClick={() => handlePostClick(post.postSeq)}>
              <CardContent className="flex justify-between gap-4 p-0 pb-4">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-1">
                    <Icons.inssiderType />
                    <span className="text-gray-700">엠드르</span>
                  </div>
                  <h4 className="font-bold text-gray-700">{post.postTitle}</h4>
                  <div className="flex items-center gap-1 text-sm text-[#989898]">
                    <span>{post.regDate}</span>
                    <div className="h-[2px] w-[2px] rounded-full bg-[#D9D9D9] p-0" />
                    <span className="flex items-center gap-1">
                      <Icons.eye className="h-[18px] w-[18px]" />
                      {post.viewCnt}
                    </span>
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
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#dcdcdc]/50 px-3 py-[7px]">
                    <button>
                      <Icons.thumbsUp className="h-4 w-4 text-gray-700" />
                    </button>
                    <span className="leading-[1] text-gray-700">{post.likeCnt}</span>
                    <button>
                      <Icons.thumbsDown className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#dcdcdc]/50 px-3 py-[7px]">
                    <Icons.comment className="h-4 w-4 text-gray-700" />
                    <span className="leading-[1] text-gray-700">{post.commentCnt}</span>
                  </div>
                </div>
                {parsePostTags(post.postTag).map(tag => (
                  <Badge key={tag} variant="tag" className="truncate">
                    #{tag}
                  </Badge>
                ))}
              </CardFooter>
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
