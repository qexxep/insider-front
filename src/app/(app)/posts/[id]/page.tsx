import { notFound } from 'next/navigation';

import { PostDetailType } from '@/entity/post';
import { BestWorstPostInfoType } from '@/entity/post/model/types';
import { ApiResponse, apiServer } from '@/shared/api';
import { PostDetail } from '@/views/posts';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getPostDetail = async (id: string) => {
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

const getBestWorstPostInfo = async (categoryCd: string) => {
  try {
    const response: ApiResponse<BestWorstPostInfoType> = await apiServer
      .post('posts/list/best-worst', {
        json: { categoryCd },
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

  const post = await getPostDetail(id);

  const bestWorstPosts = await getBestWorstPostInfo('003007');
  const bestPostInfo = bestWorstPosts?.bestPostInfo ?? null;
  const worstPostInfo = bestWorstPosts?.worstPostInfo ?? null;

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} bestPostInfo={bestPostInfo} worstPostInfo={worstPostInfo} />;
}
