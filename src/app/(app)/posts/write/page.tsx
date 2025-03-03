import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { WritePostPage } from '@/views/posts';

export default async function WritePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '/posts/write';
    const encodedRedirectPath = encodeURIComponent(pathname);

    redirect(`/?redirect=${encodedRedirectPath}`);
  }

  return <WritePostPage />;
}
