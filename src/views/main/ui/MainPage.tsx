'use client';

import ky from 'ky';

import apiClient from '@/shared/api/client';
import { Button } from '@/shared/ui';

function MainPage() {
  const signOut = async () => {
    try {
      const response = await ky.get(`/api/auth/sign-out`).json();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const search = async () => {
    try {
      const response = await ky.post('/api/search/results', {
        json: {
          keyword: '냉장고',
          sortType: 'D',
          currPage: 1,
          pageSize: 10,
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const testSearch = async () => {
    try {
      const response = await apiClient.post('/api/search/results', {
        json: {
          keyword: '냉장고',
          sortType: 'D',
          currPage: 1,
          pageSize: 10,
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHotTopics = async () => {
    try {
      const response = await ky.get(`/api/mains/hot-topic/rankings`).json<{
        status: string;
        message: string;
        data: Array<{
          topicSeq: string;
          rankNum: string;
          searchWord: string;
          searchCnt: string;
        }>;
      }>();
      console.log(response.data);
    } catch (error) {
      console.error('핫토픽 로딩 실패:', error);
    }
  };

  return (
    <div>
      <Button variant="destructive" onClick={signOut}>
        signOut
      </Button>
      <Button onClick={search}>검색 조회 1</Button>
      <Button onClick={testSearch}>검색 조회 2</Button>
      <Button onClick={fetchHotTopics}>핫토픽</Button>
    </div>
  );
}

export { MainPage };
