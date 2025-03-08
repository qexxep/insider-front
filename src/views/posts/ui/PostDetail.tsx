'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CommentCard, CommentComposer, useCommentList } from '@/feature/comment';
import { Badge, Button, Carousel, CarouselContent, CarouselItem, Icons } from '@/shared/ui';
import { Paginator } from '@/widgets';

import { useGetBestWorstPostInfo, useGetCategoryPostList, useGetPostDetail } from '../api/queries';

interface Props {
  postId: string;
  category: string;
  currentPage?: number;
}

const DEFAULT_PAGE_SIZE = 10;

export const PostDetail = ({ postId, category, currentPage = 1 }: Props) => {
  const { data: postData } = useGetPostDetail({ postSeq: postId });
  const { data: commentsData } = useCommentList({
    postSeq: postId,
    currPage: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
    sortType: 'D',
  });
  const { data: bestWorstPostsData } = useGetBestWorstPostInfo({ categoryCd: category });
  const { data: relativePostListData } = useGetCategoryPostList({
    categoryCd: category,
    currPage: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  if (!postData || !relativePostListData || !bestWorstPostsData || !commentsData) {
    throw new Error('Post not found');
  }

  const { voteInfo, fileList, ...post } = postData.data;
  const { comments } = commentsData.data;
  const { posts, totalPostCnt } = relativePostListData.data;
  const bestWorstPosts = bestWorstPostsData.data;

  const router = useRouter();
  const [page, setPage] = useState(currentPage);

  const totalPages = Math.ceil(totalPostCnt / DEFAULT_PAGE_SIZE);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className="flex w-full max-w-[1200px] flex-col justify-start py-[50px]">
      {/* 헤더 */}
      <div className="flex flex-col gap-[14px] pb-11">
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <button className="w-fit p-0 font-semibold text-primary" onClick={() => router.push(`/posts/${category}`)}>
              {post.categoryName}
            </button>
            <h1 className="text-xl font-bold text-gray-700">{post.postTitle}</h1>
          </div>
          {/* TODO 본인 게시물 여부 판단 필요 */}
          {post.owner && (
            <div className="flex gap-3">
              <Button variant="outlinePrimary" size="sm">
                글 삭제하기
              </Button>
              <Button variant="outlinePrimary" size="sm">
                글 수정하기
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div>인싸이더</div>
            <div className="h-[2px] w-[2px] bg-[#636571]" />
            <div className="flex items-center gap-1">
              <Icons.clock className="h-[18px] w-[18px] text-[#636571]" />
              <span className="text-[#636571]">9시간</span>
            </div>
            <div className="h-[2px] w-[2px] bg-[#636571]" />
            <div className="flex items-center gap-1">
              <Icons.eye className="h-[18px] w-[18px] text-[#636571]" />
              <span className="text-[#636571]">{post.viewCnt}</span>
            </div>
          </div>
          <button>
            <Icons.bookmark className="text-[#636571]" />
          </button>
        </div>
      </div>
      {/* 메인 */}
      <div className="flex flex-col gap-24 border-t border-[#E1E1E1] py-10">
        {/* TODO) 게시물 상세 이미지 캐러셀 추가 or 에디터 적용 */}
        {fileList.length > 0 && (
          <Carousel>
            <CarouselContent>
              {fileList.map(file => (
                <CarouselItem key={file.fileSeq}>
                  <Image src={'http://inssider.kro.kr' + file.fileUrl} alt={file.fileName} width={200} height={200} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        <div>{post.content}</div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-[6px]">
            {['문학', '시집', '소설', '글귀'].map((tag, index) => (
              <Badge key={`tag-${index}`} variant="tag">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-3">
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
        </div>
      </div>
      {voteInfo && Boolean(post.isVote) && (
        <div className="flex flex-col items-center gap-9 border-t border-[#E1E1E1] py-10">
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">이 게시물은 현재 투표를 받고 있습니다.</h3>
            <p className="text-lg font-normal">투표를 해주시면 다음주 토론 주제로 올라갈 가능성이 높아집니다.</p>
          </div>
          <div className="flex w-full max-w-[1080px] flex-col rounded-lg border border-[#acacac] p-7">
            <span className="mb-2 font-semibold text-[#0080FF]">게시물 투표</span>
            <p className="mb-3 text-lg font-bold text-gray-700">{voteInfo && voteInfo.voteTitle}</p>
            <div className="flex flex-col gap-3">
              {voteInfo.voteItems.map(voteItem => (
                <div
                  key={voteItem.itemSeq}
                  className="flex items-center justify-between rounded-[10px] bg-[#F2F3F6] p-6"
                >
                  <span>{voteItem.itemTitle}</span>
                  <Icons.checkCircle className="h-9 w-9 text-[#C0C0C0]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mb-4 h-5 w-full bg-gray-100" />
      <div>
        <div className="flex items-center justify-between px-5">
          <h2 className="text-xl text-gray-600">
            댓글 <span className="text-primary">{post.commentCnt}</span>
          </h2>
          <Button variant="ghost" className="flex gap-1 px-3">
            등록순
            <Icons.chevronDown className="h-5 w-5 text-primary" />
          </Button>
        </div>
        <CommentComposer postSeq={post.postSeq} onCancel={() => {}} />
        <div className="divide-y divide-[#D4D4D4]">
          {comments.map(comment => (
            <CommentCard key={comment.commentSeq} postSeq={post.postSeq} comment={comment} />
          ))}
        </div>
      </div>
      {/* 인싸이더 다른 게시물 */}
      <div className="pt-20">
        <h2 className="text-2xl font-bold text-gray-700">인싸이더 게시물</h2>
        <ul className="my-7 divide-y divide-[#c8c8c8] border-b border-t border-[#c8c8c8] [&>li]:px-5 [&>li]:py-4">
          {bestWorstPosts.bestPostInfo && (
            <Link
              href={`/posts/${category}/${bestWorstPosts.bestPostInfo.postSeq}`}
              className="flex items-center justify-between gap-4 bg-[#ffebe0] px-5 py-4"
            >
              <div className="flex items-center gap-12">
                <span className="rounded-full bg-[#ff5c00] px-[10px] font-semibold leading-7 text-white">베스트</span>
                <p className="text-lg text-gray-700">
                  {bestWorstPosts.bestPostInfo.postTitle}
                  <span className="ml-2 font-medium text-[#969696]">[{bestWorstPosts.bestPostInfo.commentCnt}]</span>
                </p>
              </div>
              <span className="whitespace-nowrap text-gray-700">{bestWorstPosts.bestPostInfo.updDate}</span>
            </Link>
          )}
          {bestWorstPosts.worstPostInfo && (
            <Link
              href={`/posts/${category}/${bestWorstPosts.worstPostInfo.postSeq}`}
              className="flex items-center justify-between gap-4 bg-[#e8e8e8] px-5 py-4"
            >
              <div className="flex items-center gap-12">
                <span className="rounded-full bg-black px-[10px] font-semibold leading-7 text-white">워스트</span>
                <p className="text-lg text-gray-700">
                  {bestWorstPosts.worstPostInfo.postTitle}
                  <span className="ml-2 font-medium text-[#969696]">[{bestWorstPosts.worstPostInfo.commentCnt}]</span>
                </p>
              </div>
              <span className="whitespace-nowrap text-gray-700">{bestWorstPosts.worstPostInfo.updDate}</span>
            </Link>
          )}
          {posts.map(relativePost => (
            <Link
              key={relativePost.postSeq}
              href={`/posts/${category}/${relativePost.postSeq}`}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-12">
                <span className="font-bold leading-7 text-[#ff5c00]">{relativePost.postSeq}</span>
                <p className="line-clamp-1 text-lg text-gray-700">
                  {relativePost.postTitle}
                  <span className="ml-2 font-medium text-[#969696]">[{relativePost.commentCnt}]</span>
                </p>
              </div>
              <span className="whitespace-nowrap text-gray-700">{relativePost.updDate}</span>
            </Link>
          ))}
        </ul>
        <Paginator currentPage={page} totalPages={totalPages} onPageChange={onPageChange} showPreviousNext />
      </div>
    </div>
  );
};
