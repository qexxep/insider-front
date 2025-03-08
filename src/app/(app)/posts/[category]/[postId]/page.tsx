import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { commentPrefetchQueries } from '@/feature/comment';
import { queryClient } from '@/shared/lib';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, PostDetail, postPrefetchQueries } from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string; postId: string }>;
  searchParams: Promise<{ [key: string]: number | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { postId, category } = await params;
  const { page } = await searchParams;

  await Promise.all([
    await postPrefetchQueries.detail(queryClient, { postSeq: postId }),
    await commentPrefetchQueries.list(queryClient, {
      postSeq: postId,
      currPage: page ?? DEFAULT_CURRENT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sortType: 'D',
    }),
    await postPrefetchQueries.bestWorst(queryClient, { categoryCd: category }),
    await postPrefetchQueries.list(queryClient, {
      categoryCd: category,
      currPage: DEFAULT_CURRENT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostDetail postId={postId} category={category} currentPage={page} />
    </HydrationBoundary>
  );
}
