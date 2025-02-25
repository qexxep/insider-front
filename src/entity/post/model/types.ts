export interface VoteItemType {
  itemTitle: string;
  voteCount: number;
  itemSeq: number;
}

export interface VoteInfoType {
  voteItems: VoteItemType[];
  voteTitle: string;
}

export interface PostDetailType {
  postSeq: string;
  categoryName: string;
  postStatus: string;
  postTitle: string;
  content: string;
  viewCnt: number;
  likeCnt: number;
  unlikeCnt: number;
  commentCnt: number;
  isVote: number;
  voteTitle: string;
  voteInfo: VoteInfoType;
  postTag: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commentInfo: any[]; // 댓글 타입이 정해지면 수정
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileList: any[];
  regId: string;
  regDate: string;
  regTime: string;
  updId: string;
  updDate: string;
  updTime: string;
}
