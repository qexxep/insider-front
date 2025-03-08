import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { queryClient } from '@/shared/lib';
import { prefetchQueries } from '@/shared/lib/tanstack-query/prefetch';
import { CategoryPostList, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  await Promise.all([
    prefetchQueries.posts.bestWorst(queryClient, { categoryCd: category }),
    prefetchQueries.posts.list(queryClient, {
      categoryCd: category,
      currPage: DEFAULT_CURRENT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPostList category={category} />
    </HydrationBoundary>
  );
}
