import { notFound } from 'next/navigation';

import { PostDetailType } from '@/entity/post';
import { ApiResponse, apiServer } from '@/shared/api';
import { PostDetail } from '@/views/posts';

interface PageProps {
  params: { id: string };
}

const getPostFromParams = async ({ params }: PageProps) => {
  try {
    const response: ApiResponse<PostDetailType> = await apiServer
      .post('posts/detail', {
        json: { postSeq: params.id },
      })
      .json();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
};

export default async function Page({ params }: Readonly<PageProps>) {
  const post = await getPostFromParams({ params });

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}
