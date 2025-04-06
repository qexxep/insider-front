'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

// 탭 타입 정의
type TabType = '내가 쓴 글' | '내가 쓴 댓글' | '저장한 글' | '즐겨찾기/북마크';

// 더미 데이터 - 실제 구현 시 API로 대체
const dummyPosts = [
  {
    id: 1,
    title: '대전에서 좋은 원룸이나 투룸 찾음',
    category: '부동산',
    isHot: true,
    date: '2024-09-28',
    views: 42,
    likes: 15,
    comments: 8,
    thumbnail: '/images/thumbnail.jpg',
  },
  {
    id: 2,
    title: '대전에서 좋은 원룸이나 투룸 찾음',
    category: '부동산',
    isHot: false,
    date: '2024-09-28',
    views: 30,
    likes: 10,
    comments: 5,
    thumbnail: '/images/thumbnail.jpg',
  },
  {
    id: 3,
    title: '대전에서 좋은 원룸이나 투룸 찾음',
    category: '부동산',
    isHot: true,
    date: '2024-09-28',
    views: 25,
    likes: 8,
    comments: 3,
    thumbnail: '/images/thumbnail.jpg',
  },
  {
    id: 4,
    title: '대전에서 좋은 원룸이나 투룸 찾음',
    category: '부동산',
    isHot: true,
    date: '2024-09-28',
    views: 18,
    likes: 6,
    comments: 2,
    thumbnail: '/images/thumbnail.jpg',
  },
  {
    id: 5,
    title: '대전에서 좋은 원룸이나 투룸 찾음',
    category: '부동산',
    isHot: false,
    date: '2024-09-28',
    views: 15,
    likes: 4,
    comments: 1,
    thumbnail: '/images/thumbnail.jpg',
  },
];

const dummyComments = [
  {
    id: 1,
    content: '2027년부터 전국 다수 인구에 수돗물서 미세 플라스틱 검출됨. 생수도 30여 제품도 검출되는데...',
    date: '2024-09-28',
    likes: 5,
    postId: 101,
  },
  {
    id: 2,
    content: '워터파크 매년 방문에서 인기가 식었네 작년에 새워진 워터파크는 생각보다 잘됐어요',
    date: '2024-09-28',
    likes: 3,
    postId: 102,
  },
  {
    id: 3,
    content: '나 20일날 식사 영양제는 4시간 전에 먹어야',
    date: '2024-09-28',
    likes: 2,
    postId: 103,
  },
  {
    id: 4,
    content: '애니 그 꿈 다시 봄',
    date: '2024-09-28',
    likes: 1,
    postId: 104,
  },
  {
    id: 5,
    content: '2027년부터 전국 다수 인구에 수돗물서 미세 플라스틱 검출됨. 생수도 30여 제품도 검출되는데...',
    date: '2024-09-28',
    likes: 0,
    postId: 105,
  },
];

const bookmarks = [
  { id: 1, name: '주택', isStarred: true },
  { id: 2, name: '인테리어', isStarred: true },
  { id: 3, name: '취업', isStarred: true },
  { id: 4, name: '자동차', isStarred: false },
  { id: 5, name: '주식', isStarred: false },
  { id: 6, name: '스포츠', isStarred: false },
  { id: 7, name: '요리법', isStarred: false },
  { id: 8, name: '여행', isStarred: false },
  { id: 9, name: '쇼핑정보', isStarred: false },
  { id: 10, name: '육아', isStarred: false },
  { id: 11, name: '반려동물', isStarred: false },
  { id: 12, name: '영화/드라마', isStarred: false },
];

export const MyPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('내가 쓴 글');

  // 사용자 정보 (실제 구현 시 API로 대체)
  const userInfo = {
    id: 'insider',
    nickname: '인사이더',
    profileImage: '/placeholder.jpg',
    level: 1,
    points: 323,
    joinDate: '2023-01-01',
  };

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // 실제 구현 시 API 응답에 따라 계산

  // 탭 변경 핸들러
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 변경 시 페이지 초기화
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 사용자 정보 렌더링
  const renderUserInfo = () => (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="relative h-20 w-20 overflow-hidden">
          {/* 퍼즐 조각 형태의 프로필 이미지 */}
          <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
            <div className="h-[38px] w-[38px] bg-[#FF6B6B]"></div>
            <div className="h-[38px] w-[38px] bg-[#4ECDC4]"></div>
            <div className="h-[38px] w-[38px] bg-[#FFD166]"></div>
            <div className="h-[38px] w-[38px] bg-[#FF8C42]"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <h2 className="text-2xl font-bold uppercase">INSIDER</h2>
            <div className="flex items-center gap-1">
              <span className="font-bold text-orange-500">내어간진</span>
              <span className="text-gray-500">TYPE</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              인사이더 타입 안내 <span className="text-gray-400">&gt;</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center border-l border-gray-200 pl-8">
          <span className="text-sm text-gray-500">발언권</span>
          <p className="text-center text-xl font-bold text-orange-500">
            <span className="text-orange-500">{userInfo.level}</span>
            <span className="text-base text-gray-500"> 개</span>
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">포인트</span>
          <p className="text-center text-xl font-bold text-orange-500">
            <span className="text-orange-500">{userInfo.points}</span>
            <span className="text-base text-gray-500"> P</span>
          </p>
        </div>
      </div>
    </div>
  );

  // 탭 메뉴 렌더링
  const renderTabs = () => (
    <div className="flex border-b">
      {(['내가 쓴 글', '내가 쓴 댓글', '저장한 글', '즐겨찾기/북마크'] as const).map(tab => (
        <button
          key={tab}
          className={cn(
            'flex-1 border-b-2 py-3 text-center font-medium',
            activeTab === tab
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
          onClick={() => handleTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  // 내가 쓴 글 렌더링
  const renderMyPosts = () => (
    <div>
      {dummyPosts.map(post => (
        <div key={post.id} className="mb-2 flex items-center gap-2 border-b py-3">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              {post.isHot && (
                <span className="rounded bg-orange-500 px-1.5 py-0.5 text-xs font-bold text-white">인기</span>
              )}
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{post.category}</span>
              <h3 className="font-medium">{post.title}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>작성일: {post.date}</span>
              <span>조회수: {post.views}</span>
              <span>좋아요: {post.likes}</span>
              <span>댓글: {post.comments}</span>
            </div>
          </div>
          {post.thumbnail && (
            <div className="relative h-16 w-20 overflow-hidden rounded">
              <Image src={post.thumbnail} alt="썸네일" fill className="object-cover" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 내가 쓴 댓글 렌더링
  const renderMyComments = () => (
    <div>
      {dummyComments.map(comment => (
        <div key={comment.id} className="mb-2 border-b py-3">
          <p className="mb-1 font-medium">{comment.content}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{comment.date}</span>
            <span>좋아요: {comment.likes}</span>
            <Link href={`/posts/${comment.postId}`} className="text-orange-500 hover:underline">
              원글 보기
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  // 저장한 글 렌더링
  const renderSavedPosts = () => (
    <div>
      {dummyPosts.map(post => (
        <div key={post.id} className="mb-2 flex items-center justify-between gap-2 border-b py-3">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              {post.isHot && (
                <span className="rounded bg-orange-500 px-1.5 py-0.5 text-xs font-bold text-white">인기</span>
              )}
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{post.category}</span>
              <h3 className="font-medium">{post.title}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>작성일: {post.date}</span>
              <span>조회수: {post.views}</span>
              <span>좋아요: {post.likes}</span>
              <span>댓글: {post.comments}</span>
            </div>
          </div>
          <div className="text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
              <path d="M6.70711 4.29289C6.31658 3.90237 5.68342 3.90237 5.29289 4.29289C4.90237 4.68342 4.90237 5.31658 5.29289 5.70711L10.5858 11H2.5C1.94772 11 1.5 11.4477 1.5 12C1.5 12.5523 1.94772 13 2.5 13H10.5858L5.29289 18.2929C4.90237 18.6834 4.90237 19.3166 5.29289 19.7071C5.68342 20.0976 6.31658 20.0976 6.70711 19.7071L13.7071 12.7071C14.0976 12.3166 14.0976 11.6834 13.7071 11.2929L6.70711 4.29289Z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );

  // 즐겨찾기/북마크 렌더링
  const renderBookmarks = () => (
    <div className="grid grid-cols-4 gap-4">
      {bookmarks.map(bookmark => (
        <div
          key={bookmark.id}
          className="flex flex-col items-center rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
          </div>
          <p className="text-center text-sm font-medium">{bookmark.name}</p>
          <button className="mt-2 text-gray-400 hover:text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={bookmark.isStarred ? 'currentColor' : 'none'}
              stroke={bookmark.isStarred ? 'none' : 'currentColor'}
              className="h-5 w-5"
              strokeWidth={1.5}
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );

  // 페이지네이션 렌더링
  const renderPagination = () => (
    <div className="mt-6 flex justify-center gap-1">
      {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded',
            currentPage === page ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          )}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
      {totalPages > 10 && (
        <button className="flex h-8 w-8 items-center justify-center rounded bg-white text-gray-700 hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );

  // 탭에 따른 컨텐츠 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case '내가 쓴 글':
        return renderMyPosts();
      case '내가 쓴 댓글':
        return renderMyComments();
      case '저장한 글':
        return renderSavedPosts();
      case '즐겨찾기/북마크':
        return renderBookmarks();
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-[868px] py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">마이페이지</h1>
        <Button variant="outline" size="sm" className="text-sm">
          회원정보 수정
        </Button>
      </div>

      {/* 사용자 정보 */}
      {renderUserInfo()}

      {/* 탭 메뉴 */}
      {renderTabs()}

      {/* 컨텐츠 */}
      <div className={`p-6 shadow-sm ${activeTab === '즐겨찾기/북마크' ? 'bg-gray-100' : 'bg-white'}`}>
        {renderContent()}
      </div>

      {/* 페이지네이션 (북마크 탭에서는 표시하지 않음) */}
      {activeTab !== '즐겨찾기/북마크' && renderPagination()}
    </div>
  );
};
