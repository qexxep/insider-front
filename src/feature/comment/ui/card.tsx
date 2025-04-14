'use client';

import { useState } from 'react';

import { useAuth } from '@/entity/auth';
import { PersonalityIcon } from '@/feature/personality';
import { formatTimeAgo } from '@/shared/lib';
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
import { useCommentReaction, useCreateComment, useDeleteComment, useUpdateComment } from '../api/queries';
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
  callback?: () => void;
}

export const Card = ({ postSeq, comment, parent, callback }: Props) => {
  const { checkLogin, isLoggedIn } = useAuth();

  const [openCommentId, setOpenCommentId] = useState<string>();
  const [isReply, setIsReply] = useState(false);
  const [target, setTarget] = useState<MentiUser>();
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: reactionComment } = useCommentReaction();
  const { mutate: createComment } = useCreateComment();
  const { mutate: updateComment } = useUpdateComment();

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

  const handleCommentReaction = (
    comment: CommentType,
    actionType: 'add' | 'remove' | 'toggle',
    reactionType: 'like' | 'unlike'
  ) => {
    if (comment.commentStatus === 'D') return;

    const isLoggedIn = checkLogin();
    if (!isLoggedIn) return;

    reactionComment(
      {
        commentSeq: comment.commentSeq,
        actionType,
        reactionType,
      },
      {
        onSuccess: () => {
          commentInvalidateQueries.lists();
        },
      }
    );
  };

  const onSubmitCreateComment = (content: string) => {
    createComment(
      {
        postSeq,
        comment: content,
        upCommentSeq: parent ? parent.commentSeq : comment.commentSeq,
        mentiUserId: target?.regId || '',
      },
      {
        onSuccess: () => {
          commentInvalidateQueries.lists();
          setIsReply(false);
          setTarget(undefined);
          callback?.();
        },
      }
    );
  };

  const handleDeleteComment = () => {
    const isLoggedIn = checkLogin();
    if (!isLoggedIn) return;
    deleteComment(
      { commentSeq: comment.commentSeq },
      {
        onSuccess: () => {
          commentInvalidateQueries.lists();
        },
      }
    );
  };

  //const handleEditComment = () => {
  //  setIsEditing(true);
  //};

  const onSubmitUpdateComment = (content: string) => {
    updateComment(
      {
        commentSeq: comment.commentSeq,
        comment: content,
        mentiUserId: comment.mentiUserId ?? '',
      },
      {
        onSuccess: () => {
          commentInvalidateQueries.lists();
        },
        onSettled: () => {
          setIsEditing(false);
        },
      }
    );
  };

  // 내 댓글 여부와 대댓글 여부에 따라 배경색 적용
  const isMyComment = comment.owner && isLoggedIn;
  const isReplyComment = parent !== undefined;

  return (
    <div
      className={cn(
        'flex gap-2 px-5 py-4',
        isReplyComment && 'pl-0',
        (isMyComment || isReplyComment) && 'bg-primary-100'
      )}
    >
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
            <span className="text-gray-500">{formatTimeAgo(comment.regDate + ' ' + comment.regTime)}</span>
            {isMyComment && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">내 댓글</span>
            )}
          </div>
        </div>
        {!isEditing ? (
          <div>{comment.comment}</div>
        ) : (
          <div>
            <Composer
              className="mb-0"
              initialComment={comment.comment}
              onSubmit={onSubmitUpdateComment}
              onCancel={() => setIsEditing(false)}
              submitText="수정하기"
            />
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex items-center justify-center gap-1">
            <button
              disabled={comment.commentStatus === 'D'}
              onClick={() => handleCommentReaction(comment, 'add', 'like')}
            >
              <Icons.thumbsUp className="h-4 w-4 text-gray-600" />
            </button>
            <span className="leading-[1] text-gray-600">{comment.likeCnt}</span>
            <button
              disabled={comment.commentStatus === 'D'}
              onClick={() => handleCommentReaction(comment, 'remove', 'like')}
            >
              <Icons.thumbsDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <button
            className="flex items-center gap-[3px] text-gray-600"
            onClick={onClickReply}
            disabled={comment.commentStatus === 'D'}
          >
            <Icons.comment className="h-4 w-4 text-gray-600" />
            답글쓰기
          </button>
          {comment.owner && comment.commentStatus === 'N' && isLoggedIn && (
            <div className="flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild className="gap-1">
                  <Button variant="link" className="h-fit p-0 text-gray-600 underline underline-offset-2">
                    <Icons.trash className="h-4 w-4 text-gray-600" />
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
              {/*<Button
                variant="link"
                className="h-fit p-0 text-primary-700 underline underline-offset-2"
                onClick={handleEditComment}
              >
                댓글 수정하기
              </Button>*/}
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
            mentiUserNickname={target?.nickname}
            onSubmit={onSubmitCreateComment}
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
