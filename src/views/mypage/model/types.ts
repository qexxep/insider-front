export interface ProfileType {
  userSeq: string;
  nickname: string;
  personaStatus: string | null;
  propensityImage: string;
  userRole: string;
  userStatus: string;
  speechQuota: string;
  point: string;
}

export interface BoardType {
  majorCategoryName: string;
  commCategoryCode: string;
  categoryList: {
    isBookmarked: boolean;
    categoryCode: string;
    categoryName: string;
  }[];
}

export interface PostType {
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
