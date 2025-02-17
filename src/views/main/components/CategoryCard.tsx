'use client';

import { useCallback } from 'react';

import { CategoryIcon } from '@/shared/components';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@/shared/ui';

import { CategoryRecentPost } from '../api/category';

interface CategoryCardProps {
  category: string;
  posts: CategoryRecentPost[];
}

export function CategoryCard({ category, posts }: CategoryCardProps) {
  const handleMoreClick = useCallback(() => {
    // TODO: 더보기 처리
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-orange-500">
          <CategoryIcon categoryName={category} />
          <span>{category}</span>
        </CardTitle>
        <Button variant="ghost" className="text-sm text-gray-400" onClick={handleMoreClick}>
          더보기 &gt;
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.postSeq} className="flex justify-between border-b py-2 last:border-0">
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
