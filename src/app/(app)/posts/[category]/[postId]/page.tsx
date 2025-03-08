import { notFound } from 'next/navigation';

import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
  getBestWorstPostInfo,
  getPostDetail,
  getPostListByCategory,
  PostDetail,
} from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string; postId: string }>;
  searchParams: Promise<{ [key: string]: number | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { postId, category } = await params;
  const { page } = await searchParams;

  const postResponse = await getPostDetail({ postSeq: postId });

  const bestWorstPostsResponse = await getBestWorstPostInfo({ categoryCd: category });

  const relativePostListResponse = await getPostListByCategory({
    categoryCd: category,
    currPage: DEFAULT_CURRENT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  if (!postResponse) {
    notFound();
  }

  return (
    <PostDetail
      category={category}
      post={postResponse.data}
      bestWorstPosts={bestWorstPostsResponse.data}
      relativePostList={relativePostListResponse.data}
      currentPage={page}
    />
  );
}
