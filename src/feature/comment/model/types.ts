export interface CommentInfoType {
  totalCommentCnt: number;
  parentCommentCnt: number;
  comments: CommentType[];
}

export interface CommentType {
  commentSeq: string;
  upCommentSeq: string;
  comment: string;
  commentStatus: string;
  mentiUserId: string;
  likeCnt: number;
  unlikeCnt: number;
  commentCnt: number;
  nickname: string;
  personaImage: string;
  regId: string;
  regDate: string;
  regTime: string;
  updId: string;
  updDate: string;
  updTime: string;
  childComments: CommentType[];
  owner: boolean;
}
