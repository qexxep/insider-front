'use client';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

import { PersonalityIcon } from '@/feature/personality';
import { cn } from '@/shared/lib/tw-utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Icons,
} from '@/shared/ui';

import { commentInvalidateQueries } from '..';
import { useDeleteComment } from '../api/queries';
import { CommentType } from '../model/types';
import { Composer } from './composer';

interface MentiUser {
  regId: string;
  commentSeq: string;
  nickname: string;
}

interface Props {
  postSeq: string;
  comment: CommentType;
  parent?: CommentType;
}

export const Card = ({ postSeq, comment, parent }: Props) => {
  const [openCommentId, setOpenCommentId] = useState<string>();
  const [isReply, setIsReply] = useState(false);
  const [target, setTarget] = useState<MentiUser>();

  const { mutate: deleteComment } = useDeleteComment();

  const onClickReply = () => {
    setOpenCommentId(comment.commentSeq);
    setIsReply(true);
    if (parent) {
      setTarget({
        regId: comment.regId,
        commentSeq: comment.commentSeq,
        nickname: comment.nickname,
      });
    }
  };

  const toggleReply = (value: string | undefined) => {
    setOpenCommentId(value);
    setIsReply(false);
    setTarget(undefined);
  };

  const handleDeleteComment = () => {
    deleteComment(
      { commentSeq: comment.commentSeq },
      {
        onSuccess: () => {
          commentInvalidateQueries.list({ postSeq, currPage: 1, pageSize: 10, sortType: 'A' });
        },
      }
    );
  };

  return (
    <div className={cn('flex gap-2 px-5 py-4', parent && 'pl-0', comment.owner && 'bg-primary-100')}>
      {parent && (
        <div className="">
          <Icons.cornerDownRight className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-1">
          {comment.mentiUserId && <span className="text-primary">@{comment.nickname}</span>}
          <div className="flex items-center gap-2">
            <PersonalityIcon code={'PIRM'} />
            <span>{comment.nickname}</span>
          </div>
          <div className="h-[2px] w-[2px] rounded-full bg-gray-500" />
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              {formatDistanceToNow(comment.regDate, { addSuffix: true, locale: ko })}
            </span>
          </div>
        </div>
        <div>{comment.comment}</div>
        <div className="flex gap-4">
          <div className="flex items-center justify-center gap-1">
            <button>
              <Icons.thumbsUp className="h-4 w-4 text-gray-600" />
            </button>
            <span className="leading-[1] text-gray-600">{comment.likeCnt}</span>
            <button>
              <Icons.thumbsDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <button className="flex items-center gap-[3px] text-gray-600" onClick={onClickReply}>
            <Icons.comment className="h-4 w-4 text-gray-600" />
            답글쓰기
          </button>
          {comment.owner && (
            <div className="flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" className="h-fit p-0 text-primary-700 underline underline-offset-2">
                    댓글 삭제하기
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[670px] gap-12 px-28 py-20">
                  <AlertDialogHeader className="flex flex-col items-center justify-center gap-3">
                    <Icons.trash className="size-12 text-gray-700" />
                    <AlertDialogTitle className="text-[32px] font-bold text-gray-900">해당 댓글 삭제</AlertDialogTitle>
                    <AlertDialogDescription className="mt-0 text-lg text-gray-900">
                      해당 댓글을 삭제하시겠습니까?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex w-full flex-row items-center justify-center gap-3 sm:justify-center">
                    <AlertDialogCancel className="m-0 h-[70px] w-[196px] rounded-[6px] border-primary text-lg font-bold text-primary hover:bg-primary-100 hover:text-primary">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="m-0 h-[70px] w-[196px] rounded-[6px] text-lg font-bold"
                      onClick={handleDeleteComment}
                    >
                      확인
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="link" className="h-fit p-0 text-primary-700 underline underline-offset-2">
                댓글 수정하기
              </Button>
            </div>
          )}
        </div>
        {comment.childComments.length > 0 && (
          <Accordion type="single" value={openCommentId} onValueChange={toggleReply} collapsible className="w-full">
            <AccordionItem value={comment.commentSeq} className="border-none p-0">
              <AccordionTrigger
                iconPosition="left"
                className="w-fit justify-start gap-1 py-0"
                iconClassName="text-primary"
                width="fit"
              >
                <p className="text-gray-600">답글 {comment.childComments.length}개</p>
              </AccordionTrigger>
              <AccordionContent className="divide-y divide-gray-400 border-none p-0 text-base">
                {comment.childComments?.map(child => (
                  <Card key={child.commentSeq} postSeq={postSeq} comment={child} parent={comment} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {isReply && (
          <Composer
            className="mb-0"
            postSeq={postSeq}
            upCommentSeq={parent ? parent.commentSeq : comment.commentSeq}
            mentiUser={target}
            onCancel={() => {
              setIsReply(false);
              setTarget(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};
