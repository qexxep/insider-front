'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib/tw-utils';
import { Button, Textarea } from '@/shared/ui';

import { commentInvalidateQueries } from '..';
import { useCreateComment } from '../api/queries';

interface Props {
  className?: string;
  postSeq: string;
  upCommentSeq?: string;
  mentiUser?: {
    regId: string;
    commentSeq: string;
    nickname: string;
  };
  onCancel: () => void;
}

export const Composer = ({ className, postSeq, upCommentSeq, mentiUser, onCancel }: Props) => {
  const [comment, setComment] = useState('');

  const { mutate: createComment } = useCreateComment();

  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    createComment(
      {
        postSeq,
        comment,
        upCommentSeq: upCommentSeq || '',
        mentiUserId: mentiUser?.regId || '',
      },
      {
        onSuccess: () => {
          commentInvalidateQueries.list({ postSeq, currPage: 1, pageSize: 10, sortType: 'A' });
          setComment('');
          onCancel();
        },
      }
    );
  };

  return (
    <div
      className={cn('mb-8 flex flex-col rounded-lg border-[2px] border-gray-300 bg-background px-5 py-4', className)}
    >
      {mentiUser && <span className="ml-[13px] mt-[9px] whitespace-nowrap text-[#1888FF]">@{mentiUser.nickname}</span>}
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
          댓글 등록
        </Button>
      </div>
    </div>
  );
};
