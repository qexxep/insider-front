export const revalidate = 60;

import { CategoryPostList } from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  return <CategoryPostList category={category} />;
}
