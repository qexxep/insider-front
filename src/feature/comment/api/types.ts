import { CommentInfoType } from '../model/types';

export interface CommentListRequest {
  postSeq: string;
  currPage: number;
  pageSize: number;
  sortType: 'D' | 'R' | 'A'; // A: 등록순/ D:최신순 / R:추천순
}

export type CommentListResponse = CommentInfoType;

export interface CreateCommentRequest {
  postSeq: string;
  comment: string;
  upCommentSeq: string;
  mentiUserId: string;
}

export type CreateCommentResponse = void;

export interface DeleteCommentRequest {
  commentSeq: string;
}

export type DeleteCommentResponse = void;

export interface UpdateCommentRequest {
  commentSeq: string;
  comment: string;
  mentiUserId: string;
}

export type UpdateCommentResponse = void;

export interface CommentReactionRequest {
  commentSeq: string;
  reactionType: 'like' | 'unlike'; // 게시글 반응 항목(좋아요: like / 싫어요: unlike)
  actionType: 'add' | 'remove' | 'toggle'; // 반응 액션 구분(add : 추가, remove: 제거, toggle: 반대로 변경(좋아요 또는 싫어요 반응이 존재하는 경우))
}

export type CommentReactionResponse = void;
