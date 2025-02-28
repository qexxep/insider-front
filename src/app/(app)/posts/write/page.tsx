import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { WritePostPage } from '@/views/posts';

export default async function WritePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    redirect('/?showLoginRequired=true');
  }

  return <WritePostPage />;
}
