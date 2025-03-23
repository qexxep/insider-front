'use client';

import { useState } from 'react';

import { useAuth } from '@/entity/auth';
import { cn } from '@/shared/lib/tw-utils';
import { Button, Textarea } from '@/shared/ui';

interface Props {
  className?: string;
  mentiUserNickname?: string;
  submitText?: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialComment?: string;
}

export const Composer = ({
  className,
  mentiUserNickname,
  submitText = '댓글 등록',
  onSubmit,
  onCancel,
  initialComment = '',
}: Props) => {
  const { checkLogin } = useAuth();
  const [comment, setComment] = useState(initialComment);

  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    const isLoggedIn = checkLogin();
    if (!isLoggedIn) return;

    onSubmit(comment);
    setComment('');
  };

  return (
    <div
      className={cn('mb-8 flex flex-col rounded-lg border-[2px] border-gray-300 bg-background px-5 py-4', className)}
    >
      {mentiUserNickname && (
        <span className="ml-[13px] mt-[9px] whitespace-nowrap text-[#1888FF]">@{mentiUserNickname}</span>
      )}
      <div className="flex">
        <Textarea
          value={comment}
          onChange={handleComment}
          placeholder="댓글을 작성해보세요."
          className={cn('resize-none border-none text-gray-600')}
        />
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-gray-300 pt-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          취소
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={comment.length === 0}
          className="disabled:bg-gray-300 disabled:text-gray-500"
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
};
