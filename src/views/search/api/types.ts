// Search

export interface Post {
  postSeq: string;
  categoryCd: string;
  categoryName: string;
  postTitle: string;
  previewContent: string;
  viewCnt: number;
  likeCnt: number;
  unlikeCnt: number;
  reactionTotal: number;
  commentCnt: number;
  isVote: number;
  postTagList: string[];
  thumbnailPath: string;
  nickname: string;
  propensityImage: string;
  regId: string;
  regDate: string;
  regTime: string;
  updId: string;
  updDate: string;
  updTime: string;
  owner: boolean;
}

export interface SearchRequest {
  keyword: string;
  sortType: 'A' | 'D' | 'R';
  currPage: number;
  pageSize: number;
}

export interface SearchResponse {
  result?: Post[];
  totalCount: number;
}
