import { cookies, headers } from 'next/headers';

import { WritePostPage } from '@/views/posts';

export default async function WritePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/posts/write';
  const encodedRedirectPath = encodeURIComponent(pathname);

  return <WritePostPage isAuthenticated={!!token} redirectPath={encodedRedirectPath} />;
}
