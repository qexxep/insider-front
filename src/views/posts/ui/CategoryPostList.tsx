'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { PostDetailType } from '@/entity/post';
import { BestWorstPostInfoDetailType } from '@/entity/post/model/types';
import { Badge, Button, Card, CardContent, CardHeader, Icons } from '@/shared/ui';
import { CardFooter } from '@/shared/ui/card';

interface Props {
  category: string;
  bestPostInfo: BestWorstPostInfoDetailType | null;
  worstPostInfo: BestWorstPostInfoDetailType | null;
  posts: PostDetailType[];
}

export const CategoryPostList = ({ category, bestPostInfo, worstPostInfo, posts }: Props) => {
  const router = useRouter();

  console.log('category', category);
  const categoryName = posts[0]?.categoryName; // todo: api 변경 요청 예정

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${category}/${postId}`);
  };

  return (
    <div className="flex w-full max-w-[1200px] flex-col justify-start py-[50px]">
      <h1 className="mb-5 w-full text-[28px] font-bold text-gray-700">{categoryName}</h1>
      {/* 필독 게시물 */}
      <div className="mb-6 flex items-center justify-between bg-primary-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary px-4 text-white">필독</span>
          <p className="text-lg">윤대통령, 기시다 후미오 일본 총리 12번째 회담</p>
        </div>
        <button>더보기</button>
      </div>
      {/* 베스트 워스트 게시물 */}
      <div className="mb-10 flex gap-7">
        <Card className="flex w-full flex-col justify-between bg-[#FC6423] text-white">
          <CardHeader className="pb-3 pt-7">
            <span className="flex w-fit items-center justify-center gap-1 rounded-[4px] bg-[#FF885F] p-2">
              <Icons.thumbsUp className="h-4 w-4" />
              <span>BEST</span>
            </span>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold">{bestPostInfo?.postTitle}</h3>
            <p className="line-clamp-1 font-normal">{bestPostInfo?.previewContent}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button className="w-full rounded-full bg-white font-bold text-primary">베스트 게시물 보러가기</Button>
          </CardFooter>
        </Card>
        <Card className="white flex w-full flex-col justify-between bg-gray-600 text-white">
          <CardHeader className="pb-3 pt-7">
            <span className="flex w-fit items-center justify-center gap-1 rounded-[4px] bg-gray-500 p-2">
              <Icons.thumbsDown className="h-4 w-4" />
              <span>WORST</span>
            </span>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold">{worstPostInfo?.postTitle}</h3>
            <p className="line-clamp-1 font-normal">{worstPostInfo?.previewContent}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full rounded-full bg-white font-bold text-gray-600">워스트 게시물 보러가기</Button>
          </CardFooter>
        </Card>
      </div>
      {/* 전체 게시물 */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">전체 게시물</h2>
          <Button variant="ghost" className="px-3">
            최신순
            <Icons.ArrowUpDown />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {posts.map(post => (
            <Card key={post.postSeq} className="cursor-pointer p-6" onClick={() => handlePostClick(post.postSeq)}>
              <CardContent className="flex justify-between gap-4 p-0 pb-4">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-1">
                    <Icons.inssiderType />
                    <span className="text-gray-700">엠드르</span>
                  </div>
                  <h4 className="font-bold text-gray-700">{post.postTitle}</h4>
                  <div className="flex items-center gap-1 text-sm text-[#989898]">
                    <span>{post.regDate}</span>
                    <div className="h-[2px] w-[2px] rounded-full bg-[#D9D9D9] p-0" />
                    <span className="flex items-center gap-1">
                      <Icons.eye className="h-[18px] w-[18px]" />
                      {post.viewCnt}
                    </span>
                  </div>
                </div>
                {post.thumbnailPath && (
                  <div>
                    <Image src={post.thumbnailPath} alt={post.postTitle + 'thumbnail image'} width={64} height={64} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-[6px] gap-y-2 p-0">
                <div className="mr-2 flex items-center gap-3">
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#dcdcdc]/50 px-3 py-[7px]">
                    <button>
                      <Icons.thumbsUp className="h-4 w-4 text-gray-700" />
                    </button>
                    <span className="leading-[1] text-gray-700">{post.likeCnt}</span>
                    <button>
                      <Icons.thumbsDown className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#dcdcdc]/50 px-3 py-[7px]">
                    <Icons.comment className="h-4 w-4 text-gray-700" />
                    <span className="leading-[1] text-gray-700">{post.commentCnt}</span>
                  </div>
                </div>
                {['문학', '시집', '소설', '글귀'].map((tag, index) => (
                  <Badge key={`tag-${index}`} variant="tag" className="truncate">
                    #{tag}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
