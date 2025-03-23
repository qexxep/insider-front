import { use } from 'react';

import { PostDetail } from '@/views/posts';

interface PageProps {
  params: Promise<{
    category: string;
    postId: string;
  }>;
  searchParams: Promise<{ [key: string]: number | undefined }>;
}

export default function Page({ params, searchParams }: PageProps) {
  const { postId, category } = use(params);
  const { page } = use(searchParams);

  return <PostDetail postId={postId} category={category} currentPage={page} />;
}
