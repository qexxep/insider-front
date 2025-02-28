import { notFound } from 'next/navigation';

import { PostDetailType } from '@/entity/post';
import { BestWorstPostInfoType } from '@/entity/post/model/types';
import { ApiResponse, apiServer } from '@/shared/api';
import { PostDetail } from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string; postId: string }>;
}

const getPostDetail = async (postId: string) => {
  try {
    const response: ApiResponse<PostDetailType> = await apiServer
      .post('posts/detail', {
        json: { postSeq: postId },
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
  const { postId, category } = await params;

  const post = await getPostDetail(postId);

  const bestWorstPosts = await getBestWorstPostInfo(category);
  const bestPostInfo = bestWorstPosts?.bestPostInfo ?? null;
  const worstPostInfo = bestWorstPosts?.worstPostInfo ?? null;

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} category={category} bestPostInfo={bestPostInfo} worstPostInfo={worstPostInfo} />;
}
