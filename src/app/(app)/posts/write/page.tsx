import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { WritePostPage } from '@/views/posts';

// Use a more generic type for searchParams to satisfy PageProps
interface WritePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

  // Safely access the category from resolved searchParams
  const resolvedSearchParams = await searchParams;
  const initialCategory = resolvedSearchParams?.category as string | undefined;

  return <WritePostPage initialCategory={initialCategory} />;
}
