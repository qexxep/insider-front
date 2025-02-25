import { notFound } from 'next/navigation';

import { PostDetailType } from '@/entity/post';
import { ApiResponse, apiServer } from '@/shared/api';
import { PostDetail } from '@/views/posts';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getPostFromParams = async (id: string) => {
  try {
    const response: ApiResponse<PostDetailType> = await apiServer
      .post('posts/detail', {
        json: { postSeq: id },
      })
      .json();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
};

export default async function Page({ params }: PageProps) {
  const id = (await params).id;

  const post = await getPostFromParams(id);

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}
