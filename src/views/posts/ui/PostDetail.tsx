import { PostDetailType } from '@/entity/post';

interface Props {
  post: PostDetailType;
}

export const PostDetail = ({ post }: Props) => {
  console.log(post);
  return <div className="flex w-full flex-col justify-start">{post.postTitle}</div>;
};
