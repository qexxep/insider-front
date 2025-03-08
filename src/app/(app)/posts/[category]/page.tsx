import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { queryClient } from '@/shared/lib';
import { CategoryPostList, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, postPrefetchQueries } from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  await Promise.all([
    postPrefetchQueries.bestWorst(queryClient, { categoryCd: category }),
    postPrefetchQueries.list(queryClient, {
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
