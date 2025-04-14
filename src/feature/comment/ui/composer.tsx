'use client';

import { useState } from 'react';

import { useAuth } from '@/entity/auth';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/tw-utils';
import { Button, Textarea } from '@/shared/ui';

import { MAX_COMMENT_LENGTH } from '../consts';

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
  const { toast } = useToast();
  const [comment, setComment] = useState(initialComment);

  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // 1000자 제한 적용
    if (newValue.length <= MAX_COMMENT_LENGTH) {
      setComment(newValue);
    } else {
      // 컴포넌트 내부에서 직접 toast 사용
      toast({
        variant: 'destructive',
        title: '댓글 제한',
        description: '댓글은 1000자 이하로 작성해주세요.',
      });
    }
  };

  const handleSubmit = () => {
    if (comment.length === 0) return;
    const isLoggedIn = checkLogin();
    if (!isLoggedIn) return;

    onSubmit(comment);
    setComment('');
  };

  // 현재 글자 수 계산
  const currentLength = comment.length;
  // 글자 수 제한에 가까워지면 경고 색상으로 표시
  const isNearLimit = currentLength >= MAX_COMMENT_LENGTH * 0.9;
  const isAtLimit = currentLength >= MAX_COMMENT_LENGTH;

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
          maxLength={MAX_COMMENT_LENGTH}
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-gray-300 pt-4">
        <div className="text-sm">
          <span className="text-gray-500">최대 글자수 : </span>
          <span
            className={cn(isAtLimit ? 'font-medium text-red-500' : isNearLimit ? 'text-amber-500' : 'text-gray-600')}
          >
            {currentLength}/{MAX_COMMENT_LENGTH}자
          </span>
        </div>
        <div className="flex items-center gap-2">
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
    </div>
  );
};
