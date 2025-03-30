import { CommentInfoType } from '@/feature/comment';

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
  categoryCd: string;
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
  voteInfo: VoteInfoType; // TODO) string인 경우 처리 필요
  postTagList: string[];
  commentInfo: CommentInfoType;
  fileList: FileType[];
  nickname: string;
  personaImage: string;
  regId: string;
  regDate: string;
  regTime: string;
  updId: string;
  updDate: string;
  updTime: string;
  owner: boolean;
}

export interface FileType {
  fileSeq: string;
  filePath: string;
  fileUrl: string;
  fileName: string;
}

export interface PostPreviewType {
  postSeq: string;
  postTitle: string;
  previewContent: string;
  viewCnt: number;
  likeCnt: number;
  unlikeCnt: number;
  commentCnt: number;
  postTagList: string[];
  thumbnailPath?: string;
  nickname: string;
  personaImage: string;
  regId: number;
  regDate: number;
  regTime: number;
  updId: number;
  updDate: number;
  updTime: number;
  owner: boolean;
  isVote: number;
}
