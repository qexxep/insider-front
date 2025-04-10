export const revalidate = 60;

import { PostDetail } from '@/views/posts';

interface PageProps {
  params: Promise<{
    category: string;
    postId: string;
  }>;
  searchParams: Promise<{ [key: string]: number | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { postId, category } = await params;
  const { page } = await searchParams;

  return <PostDetail postId={postId} category={category} currentPage={page} />;
}
