import ky from 'ky';

export interface HotTopic {
  topicSeq: string;
  rankNum: string;
  searchWord: string;
  searchCnt: string;
}

interface HotTopicsResponse {
  status: string;
  message: string;
  data: HotTopic[];
}

export const getHotTopics = async (): Promise<HotTopicsResponse> => {
  return await ky.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mains/hot-topic/rankings`).json();
};
