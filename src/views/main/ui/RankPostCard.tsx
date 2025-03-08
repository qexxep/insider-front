import Link from 'next/link';

import { Icons } from '@/shared/ui';

import { InsiderRanking } from '../api/insider';

export function RankPostCard({ data }: { data: InsiderRanking }) {
  return (
    <Link
      href={`/posts/${data.categoryCd}/${data.postSeq}`}
      className="flex items-center gap-4 border-b border-[#d4d4d4] px-2 py-4 hover:bg-gray-50"
    >
      <span className="text-md w-6 self-start font-bold text-orange-500">{data.rankNum}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="rounded-sm bg-orange-100 px-1.5 py-0.5 text-sm font-medium text-orange-600">
            {data.categoryName}
          </div>
          <div className="text-md truncate font-medium text-[#242424]">{data.postTitle}</div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1 text-xs">
            <Icons.clock className="h-4 w-4" />
            {data.regDate}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Icons.eye className="h-4 w-4" />
            {data.viewCnt}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Icons.thumbsUp className="h-4 w-4" />
            {data.likeCnt}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center rounded-lg bg-gray-100 p-2">
        <span className="text-sm font-bold text-gray-600">{data.commentCnt}</span>
        <span className="text-xs text-gray-500">댓글</span>
      </div>
    </Link>
  );
}
