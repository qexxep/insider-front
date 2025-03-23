'use client';

import { use } from 'react';

import { WritePostPage } from '@/views/posts/ui/WritePostPage';

interface Props {
  params: Promise<{
    category: string;
    postId: string;
  }>;
}

export default function EditPostPage({ params }: Props) {
  const { postId, category } = use(params);
  return <WritePostPage mode="edit" initialPostId={postId} initialCategory={category} />;
}
