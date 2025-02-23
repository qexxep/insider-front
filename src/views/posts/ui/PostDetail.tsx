import { PostDetailType } from '@/entity/post';
import { Button, Icons } from '@/shared/ui';

interface Props {
  post: PostDetailType;
}

export const PostDetail = ({ post }: Props) => {
  console.log(post);
  return (
    <div className="flex w-[1200px] flex-col justify-start py-[50px]">
      {/* 헤더 */}
      <div className="flex flex-col gap-[14px] border-b border-[#E1E1E1] pb-11">
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-primary">{post.categoryName}</span>
            <h1 className="text-xl font-bold text-gray-700">{post.postTitle}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outlinePrimary" size="sm">
              글 삭제하기
            </Button>
            <Button variant="outlinePrimary" size="sm">
              글 수정하기
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div>인싸이더</div>
            <div className="h-[2px] w-[2px] bg-[#636571]" />
            <div className="flex items-center gap-1">
              <Icons.clock className="h-[18px] w-[18px] text-[#636571]" />
              <span className="text-[#636571]">9시간</span>
            </div>
            <div className="h-[2px] w-[2px] bg-[#636571]" />
            <div className="flex items-center gap-1">
              <Icons.eye className="h-[18px] w-[18px] text-[#636571]" />
              <span className="text-[#636571]">{post.viewCnt}</span>
            </div>
          </div>
          <button>
            <Icons.bookmark className="text-[#636571]" />
          </button>
        </div>
      </div>
      {/* 메인 */}
      <div className="py-10">
        <div>images</div>
        <div>{post.content}</div>
        <div>
          <div>태그</div>
          <div>리액션</div>
        </div>
      </div>
      <div>투표</div>
      <div>
        <div>댓글 목록</div>
        <div>댓글 작성</div>
      </div>
      <div>다른 게시물</div>
    </div>
  );
};
