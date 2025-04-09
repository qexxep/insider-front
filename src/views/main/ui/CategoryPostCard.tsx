'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CategoryIcon } from '@/shared/components';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@/shared/ui';

import { CategoryInfo } from '../api/types';

export function CategoryPostCard({ data }: { data: CategoryInfo }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/posts/${data.categoryCode}`);
  };

  return (
    <Card key={data.categoryCode} className="cursor-pointer transition-all hover:shadow-md" onClick={handleCardClick}>
      <CardHeader className="flex flex-row items-center justify-between px-3 pb-0 pt-2">
        <CardTitle className="text-md flex items-center gap-2 text-orange-500">
          <CategoryIcon categoryName={data.categoryName} className="text-orange-500" />
          <span>{data.categoryName}</span>
        </CardTitle>
        <Link href={`/posts/${data.categoryCode}`} onClick={e => e.stopPropagation()}>
          <Button variant="ghost" className="text-gray-gray-900 !mt-0 h-5 justify-end p-2 !text-right text-sm">
            더보기 &gt;
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-2 px-3">
        <div className="space-y-1">
          {data.recentPostList.map(post => (
            <Link
              key={post.postSeq}
              href={`/posts/${data.categoryCode}/${post.postSeq}`}
              className="flex justify-between border-b p-2 last:border-0 hover:bg-gray-50"
              onClick={e => e.stopPropagation()}
            >
              <span className="text-sm">{post.postTitle}</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex min-w-[45px] items-center gap-1">
                  <Icons.thumbsUp className="h-4 w-4" />
                  {post.likeCnt}
                </span>
                <span className="flex min-w-[45px] items-center gap-1">
                  <Icons.messageSquare className="h-4 w-4" />
                  {post.commentCnt}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
