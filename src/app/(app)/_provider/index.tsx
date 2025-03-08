'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

import { queryClient as defaultQueryClient } from '@/shared/lib';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(defaultQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true} />}
    </QueryClientProvider>
  );
}
