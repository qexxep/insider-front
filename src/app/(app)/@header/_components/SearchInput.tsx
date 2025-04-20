'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Icons, Input } from '@/shared/ui';

export const SearchInput = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search to avoid too many navigations
  useEffect(() => {
    if (!searchQuery) return;

    const timer = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, router]);

  return (
    <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/4 -translate-y-1/2 max-sm:w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[557px]">
      <div className="relative flex h-full w-full items-center">
        <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
        <Input
          type="search"
          placeholder="검색어를 입력하세요."
          className="h-10 w-full rounded-full border-primary pl-10 focus:border-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
