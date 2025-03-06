import { notFound } from 'next/navigation';

import { ApiResponse, apiServer } from '@/shared/api';
import { BestWorstPostInfoType, CategoryPostList, PostListResponse } from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string }>;
}

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

const getPostListByCategory = async (categoryCd: string) => {
  const DEFAULT_CURRENT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 10;
  try {
    const response: ApiResponse<PostListResponse> = await apiServer
      .post('posts/list', {
        json: { categoryCd, currPage: DEFAULT_CURRENT_PAGE, pageSize: DEFAULT_PAGE_SIZE },
      })
      .json();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
};

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  const bestWorstPosts = await getBestWorstPostInfo(category);
  const bestPostInfo = bestWorstPosts?.bestPostInfo ?? null;
  const worstPostInfo = bestWorstPosts?.worstPostInfo ?? null;

  const postList = await getPostListByCategory(category);

  if (!postList) {
    notFound();
  }

  return (
    <CategoryPostList
      category={category}
      postList={postList}
      bestPostInfo={bestPostInfo}
      worstPostInfo={worstPostInfo}
    />
  );
}
