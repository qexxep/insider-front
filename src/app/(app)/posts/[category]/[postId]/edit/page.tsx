'use client';

import { WritePostPage } from '@/views/posts/ui/WritePostPage';

interface Props {
  params: {
    category: string;
    postId: string;
  };
}

export default function EditPostPage({ params }: Props) {
  return <WritePostPage mode="edit" initialPostId={params.postId} initialCategory={params.category} />;
}
