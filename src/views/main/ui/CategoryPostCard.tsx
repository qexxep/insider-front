import Link from 'next/link';

import { CategoryIcon } from '@/shared/components';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@/shared/ui';

import { CategoryInfo } from '../api/category';

export function CategoryPostCard({ data }: { data: CategoryInfo }) {
  return (
    <Card key={data.categoryCode}>
      <CardHeader className="flex flex-row items-center justify-between px-3 pb-0 pt-2">
        <CardTitle className="text-md flex items-center gap-2 text-orange-500">
          <CategoryIcon categoryName={data.categoryName} />
          <span>{data.categoryName}</span>
        </CardTitle>
        <Link href={`/posts/${data.categoryCode}`}>
          <Button variant="ghost" className="!mt-0 h-5 justify-end p-2 !text-right text-sm text-gray-400">
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
              className="flex justify-between border-b py-2 last:border-0 hover:bg-gray-50"
            >
              <span className="text-sm">{post.postTitle}</span>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Icons.thumbsUp className="h-4 w-4" />
                  {post.likeCnt}
                </span>
                <span className="flex items-center gap-1">
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
