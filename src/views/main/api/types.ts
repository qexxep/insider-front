export interface CategoryRecentPost {
  postSeq: string;
  categoryCd: string;
  categoryName: string | null;
  postTitle: string;
  previewContent: string;
  viewCnt: string;
  likeCnt: string;
  unlikeCnt: string;
  commentCnt: string;
  postTag: string;
  thumbnailPath: string;
  regId: string;
  regDate: string;
  regTime: string;
  updId: string;
  updDate: string;
  updTime: string;
}

export interface CategoryInfo {
  recentPostList: CategoryRecentPost[];
  categoryCode: string;
  categoryName: string;
}

export interface MajorCategory {
  majorCategoryName: string;
  commCategoryCode: string;
  categoryList: CategoryInfo[];
}
export interface InsiderRanking {
  postSeq: string;
  rankNum: string;
  postTitle: string;
  categoryCd: string;
  categoryName: string;
  viewCnt: string;
  likeCnt: string;
  commentCnt: string;
  thumbnailPath: string | null;
  regDate: string;
  regTime: string;
}

export interface InsiderRankingResponse {
  data: InsiderRanking[];
}

export interface CategoryRecentPostResponse {
  data: MajorCategory[];
}
