import React from 'react';

import { Icons } from '@/shared/ui';

import { InsiderRanking } from '../api/insider';

// Insider Ranking Section Component
export function InsiderRankingSection({ rankings }: { rankings: InsiderRanking[] }) {
  return (
    <React.Fragment>
      <h2 className="mb-2 text-xl font-bold">인싸이더 랭킹</h2>
      <div className="mb-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {rankings?.map(ranking => (
          <div key={ranking.postSeq} className="flex items-center gap-4 border-b border-[#d4d4d4] px-2 py-4">
            <span className="text-md w-6 self-start font-bold text-orange-500">{ranking.rankNum}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="rounded-sm bg-orange-100 px-1.5 py-0.5 text-sm font-medium text-orange-600">
                  {ranking.categoryName}
                </div>
                <div className="text-md truncate font-medium text-gray-900">{ranking.postTitle}</div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1 text-xs">
                  <Icons.clock className="h-4 w-4" />
                  {ranking.regDate}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Icons.eye className="h-4 w-4" />
                  {ranking.viewCnt}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Icons.thumbsUp className="h-4 w-4" />
                  {ranking.likeCnt}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-100 p-2">
              <span className="text-sm font-bold text-gray-600">{ranking.commentCnt}</span>
              <span className="text-xs text-gray-500">댓글</span>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
