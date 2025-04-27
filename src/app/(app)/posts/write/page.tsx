import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { WritePostPage } from '@/views/posts';

interface WritePageProps {
  searchParams: { category?: string };
}

export default async function WritePage({ searchParams }: WritePageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '/posts/write';
    const encodedRedirectPath = encodeURIComponent(pathname);

    redirect(`/?redirect=${encodedRedirectPath}`);
  }

  // 카테고리 파라미터가 있으면 WritePostPage에 전달
  const initialCategory = searchParams.category;

  return <WritePostPage initialCategory={initialCategory} />;
}
