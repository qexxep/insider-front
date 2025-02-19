'use client';
import React from 'react';

import { CategoryIcon } from '@/shared/components';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@/shared/ui';

import { MajorCategory } from '../api/category';

// Category Recent Posts Section Component
export function CategoryRecentPostsSection({ recentPosts }: { recentPosts: MajorCategory[] }) {
  return (
    <React.Fragment>
      {recentPosts?.map(data => (
        <React.Fragment key={data.commCategoryCode}>
          <h2 className="mb-4 mt-10 text-xl font-bold">{data.majorCategoryName}</h2>
          <div className="grid grid-cols-2 gap-5">
            {data.categoryList.map(category => (
              <Card key={category.categoryCode}>
                <CardHeader className="flex flex-row items-center justify-between px-3 pb-0 pt-2">
                  <CardTitle className="text-md flex items-center gap-2 text-orange-500">
                    <CategoryIcon categoryName={category.categoryName} />
                    <span>{category.categoryName}</span>
                  </CardTitle>
                  <Button variant="ghost" className="!mt-0 h-5 justify-end p-2 !text-right text-sm text-gray-400">
                    더보기 &gt;
                  </Button>
                </CardHeader>
                <CardContent className="p-2 px-3">
                  <div className="space-y-1">
                    {category.recentPostList.map(post => (
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
            ))}
          </div>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
