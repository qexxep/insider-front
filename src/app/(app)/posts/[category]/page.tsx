import { notFound } from 'next/navigation';

import {
  CategoryPostList,
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
  getBestWorstPostInfo,
  getPostListByCategory,
} from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  const bestWorstPosts = await getBestWorstPostInfo({ categoryCd: category });

  const postListResponse = await getPostListByCategory({
    categoryCd: category,
    currPage: DEFAULT_CURRENT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  if (!postListResponse.data) {
    notFound();
  }

  return <CategoryPostList category={category} postList={postListResponse.data} bestWorstPosts={bestWorstPosts.data} />;
}
