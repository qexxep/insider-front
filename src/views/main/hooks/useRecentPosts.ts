'use client';

import { useEffect, useState } from 'react';

import { type CategoryRecentPost, getCategoryRecentPosts } from '../api/category';

export const useRecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState<Record<string, CategoryRecentPost[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setIsLoading(true);
        const response = await getCategoryRecentPosts();
        if (response.status === 'SUCCESS') {
          setRecentPosts(response.data);
        } else {
          setError(new Error(response.message));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recent posts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return { recentPosts, isLoading, error };
};
