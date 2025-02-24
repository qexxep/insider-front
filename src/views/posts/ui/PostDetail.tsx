import { PostDetailType } from '@/entity/post';
import { Badge, Button, Icons } from '@/shared/ui';

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
      <div className="flex flex-col gap-24 border-b border-[#E1E1E1] py-10">
        {post.fileList.length > 0 && post.fileList.map(file => <div key={file.id}>{file.fileName}</div>)}
        <div>{post.content}</div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-[6px]">
            {['문학', '시집', '소설', '글귀'].map((tag, index) => (
              <Badge key={`tag-${index}`} variant="tag">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-3">
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
        </div>
      </div>
      <div className="flex flex-col gap-9 py-10">
        <div className="flex flex-col items-center gap-3">
          <h3>이 게시물은 현재 투표를 받고 있습니다.</h3>
          <p>투표를 해주시면 다음주 토론 주제로 올라갈 가능성이 높아집니다.</p>
        </div>
        <div>투표 박스</div>
      </div>
      <div className="h-5 w-full bg-gray-100" />
      <div>
        <div>댓글 목록</div>
        <div>댓글 작성</div>
      </div>
      <div>다른 게시물</div>
    </div>
  );
};
