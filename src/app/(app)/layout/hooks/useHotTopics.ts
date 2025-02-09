import { useEffect, useState } from 'react';

import { getHotTopics, HotTopic } from '../api/hotTopics';

export const useHotTopics = () => {
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHotTopics = async () => {
      try {
        const response = await getHotTopics();
        setHotTopics(response.data);
      } catch (err) {
        console.error('핫토픽 로딩 실패:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotTopics();
  }, []);

  return { hotTopics, isLoading, error };
};
