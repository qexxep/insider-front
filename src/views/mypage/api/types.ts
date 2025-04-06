import { BoardType, PostType, ProfileType } from '../model/types';

export type ProfileResponse = ProfileType;
export type BookmarksResponse = BoardType[];
export interface ScrapPostsRequest {
  currPage: number;
  pageSize: number;
}
export interface ScrapPostsResponse {
  totalCount: number;
}

export interface PostsRequest {
  currPage: number;
  pageSize: number;
}
export interface PostsResponse {
  totalCount: number;
  result: PostType[];
}

export interface CommentsRequest {
  currPage: number;
  pageSize: number;
}
export interface CommentsResponse {
  totalCount: number;
}

export interface SaveBookmarksRequest {
  categoryCd: string;
}
export type SaveBookmarksResponse = void;

export interface DeleteBookmarksRequest {
  bookmarkSeq: string;
}
export type DeleteBookmarksResponse = void;
