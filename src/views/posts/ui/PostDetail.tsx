'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge, Button, Icons } from '@/shared/ui';
import { Paginator } from '@/widgets';

import { PostDetailType, PostPreviewType, VoteInfoType } from '../model/types';

interface Props {
  post: PostDetailType;
  category: string;
  bestPostInfo: PostPreviewType | null;
  worstPostInfo: PostPreviewType | null;
  relativePosts: PostPreviewType[];
  currentPage?: number;
}

export const PostDetail = ({ post, category, bestPostInfo, worstPostInfo, relativePosts, currentPage = 1 }: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(currentPage);

  // TODO) voteInfo 역직력화 이슈 수정 요청
  const parsedVoteInfo = post.voteInfo ? (JSON.parse(post.voteInfo as string) as VoteInfoType) : null;

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
          <div className="flex gap-3">
            <Button variant="outlinePrimary" size="sm">
              글 삭제하기
            </Button>
            <Button variant="outlinePrimary" size="sm">
              글 수정하기
            </Button>
          </div>
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
        {post.fileList?.length > 0 &&
          post.fileList.map((file, index) => <div key={file.id + '_' + index}>{file.fileName}</div>)}
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
      {parsedVoteInfo && Boolean(post.isVote) && (
        <div className="flex flex-col items-center gap-9 border-t border-[#E1E1E1] py-10">
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">이 게시물은 현재 투표를 받고 있습니다.</h3>
            <p className="text-lg font-normal">투표를 해주시면 다음주 토론 주제로 올라갈 가능성이 높아집니다.</p>
          </div>
          <div className="flex w-full max-w-[1080px] flex-col rounded-lg border border-[#acacac] p-7">
            <span className="mb-2 font-semibold text-[#0080FF]">게시물 투표</span>
            <p className="mb-3 text-lg font-bold text-gray-700">{parsedVoteInfo && parsedVoteInfo.voteTitle}</p>
            <div className="flex flex-col gap-3">
              {parsedVoteInfo &&
                parsedVoteInfo.voteItems.map(voteItem => (
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
        <div>댓글 목록</div>
        <div>댓글 작성</div>
      </div>
      {/* 인싸이더 다른 게시물 */}
      <div className="pt-20">
        <h2 className="text-2xl font-bold text-gray-700">인싸이더 게시물</h2>
        <ul className="my-7 divide-y divide-[#c8c8c8] border-b border-t border-[#c8c8c8] [&>li]:px-5 [&>li]:py-4">
          {bestPostInfo && (
            <Link
              href={`/posts/${category}/${bestPostInfo.postSeq}`}
              className="flex items-center justify-between gap-4 bg-[#ffebe0] px-5 py-4"
            >
              <div className="flex items-center gap-12">
                <span className="rounded-full bg-[#ff5c00] px-[10px] font-semibold leading-7 text-white">베스트</span>
                <p className="text-lg text-gray-700">
                  {bestPostInfo.postTitle}
                  <span className="ml-2 font-medium text-[#969696]">[{bestPostInfo.viewCnt}]</span>
                </p>
              </div>
              <span className="whitespace-nowrap text-sm text-gray-700">{bestPostInfo.updDate}</span>
            </Link>
          )}
          {worstPostInfo && (
            <Link
              href={`/posts/${category}/${worstPostInfo.postSeq}`}
              className="flex items-center justify-between gap-4 bg-[#e8e8e8] px-5 py-4"
            >
              <div className="flex items-center gap-12">
                <span className="rounded-full bg-black px-[10px] font-semibold leading-7 text-white">워스트</span>
                <p className="text-lg text-gray-700">
                  {worstPostInfo.postTitle}
                  <span className="ml-2 font-medium text-[#969696]">[{worstPostInfo.viewCnt}]</span>
                </p>
              </div>
              <span className="whitespace-nowrap text-sm text-gray-700">{worstPostInfo.updDate}</span>
            </Link>
          )}
          {relativePosts.map(relativePost => (
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
              <span className="whitespace-nowrap text-sm text-gray-700">{relativePost.updDate}</span>
            </Link>
          ))}
        </ul>
        <Paginator currentPage={page} totalPages={20} onPageChange={page => setPage(page)} showPreviousNext />
      </div>
    </div>
  );
};
