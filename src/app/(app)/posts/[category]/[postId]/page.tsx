import { notFound } from 'next/navigation';

import { ApiResponse, apiServer } from '@/shared/api';
import { BestWorstPostInfoResponse, PostDetail, PostDetailResponse, PostListResponse } from '@/views/posts';

interface PageProps {
  params: Promise<{ category: string; postId: string }>;
  searchParams: Promise<{ [key: string]: number | undefined }>;
}

const getPostDetail = async (postId: string) => {
  try {
    const response: ApiResponse<PostDetailResponse> = await apiServer
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
    const response: ApiResponse<BestWorstPostInfoResponse> = await apiServer
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

const getPostsByCategory = async (categoryCd: string, page?: number) => {
  const DEFAULT_CURRENT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 10;
  try {
    const response: ApiResponse<PostListResponse> = await apiServer
      .post('posts/list', {
        json: { categoryCd, currPage: page ?? DEFAULT_CURRENT_PAGE, pageSize: DEFAULT_PAGE_SIZE },
      })
      .json();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
};

export default async function Page({ params, searchParams }: PageProps) {
  const { postId, category } = await params;
  const { page } = await searchParams;

  const post = await getPostDetail(postId);

  const bestWorstPosts = await getBestWorstPostInfo(category);
  const bestPostInfo = bestWorstPosts?.bestPostInfo ?? null;
  const worstPostInfo = bestWorstPosts?.worstPostInfo ?? null;

  const relativePostList = await getPostsByCategory(category, page);

  if (!post) {
    notFound();
  }

  return (
    <PostDetail
      post={post}
      category={category}
      bestPostInfo={bestPostInfo}
      worstPostInfo={worstPostInfo}
      relativePostList={relativePostList}
      currentPage={page}
    />
  );
}
