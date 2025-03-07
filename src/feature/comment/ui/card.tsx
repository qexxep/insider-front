import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

import { PersonalityIcon } from '@/feature/personality';
import { cn } from '@/shared/lib/tw-utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Icons } from '@/shared/ui';

import { CommentType } from '../model/types';
import { Composer } from './composer';

interface Props {
  postSeq: string;
  comment: CommentType;
  parent?: CommentType;
}

export const Card = ({ postSeq, comment, parent }: Props) => {
  const [openCommentId, setOpenCommentId] = useState<string>();
  const [isReply, setIsReply] = useState(false);
  const [mentiUser, setMentiUser] = useState<{
    regId: string;
    commentSeq: string;
    nickname: string;
  }>();

  const onClickReply = () => {
    setOpenCommentId(comment.commentSeq);
    setIsReply(true);
    if (parent) {
      setMentiUser({
        regId: comment.regId,
        commentSeq: comment.commentSeq,
        nickname: comment.nickname,
      });
    }
  };

  const toggleReply = (value: string | undefined) => {
    setOpenCommentId(value);
    setIsReply(false);
    setMentiUser(undefined);
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
          <div className="flex items-center gap-2">
            <PersonalityIcon code={'CSEM'} />
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
              <Button variant="link" className="h-fit p-0 text-primary-500 underline underline-offset-2">
                댓글 삭제하기
              </Button>
              <Button variant="link" className="h-fit p-0 text-primary-500 underline underline-offset-2">
                댓글 수정하기
              </Button>
            </div>
          )}
        </div>
        {comment.childComments.length > 0 && (
          <Accordion type="single" value={openCommentId} onValueChange={toggleReply} collapsible className="w-fit">
            <AccordionItem value={comment.commentSeq} className="border-none p-0">
              <AccordionTrigger
                iconPosition="left"
                className="w-fit justify-start gap-1 py-0"
                iconClassName="text-primary"
                width="fit"
              >
                <p className="text-gray-600">답글 {comment.childComments.length}개</p>
              </AccordionTrigger>
              <AccordionContent className="divide-y divide-[#D4D4D4] border-none p-0 text-base">
                {comment.childComments.map(child => (
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
            mentiUser={mentiUser}
            onCancel={() => {
              setIsReply(false);
              setMentiUser(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};
