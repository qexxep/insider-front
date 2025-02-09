'use client';

import { useEffect, useState } from 'react';

import { getRankings, type InsiderRanking } from '../api/insider';

export const useRankings = () => {
  const [rankings, setRankings] = useState<InsiderRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        const response = await getRankings();
        if (response.status === 'SUCCESS') {
          setRankings(response.data);
        } else {
          setError(new Error(response.message));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch rankings'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return { rankings, isLoading, error };
};
