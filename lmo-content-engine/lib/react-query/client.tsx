'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

// Feature flag for easy rollback
const ENABLE_CACHING = process.env.NEXT_PUBLIC_ENABLE_CACHING !== 'false';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Conservative cache times for Phase 1
            staleTime: ENABLE_CACHING ? 30 * 1000 : 0, // 30 seconds (conservative)
            gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch on window focus (can be annoying)
            refetchOnReconnect: true, // Do refetch when reconnecting
          },
          mutations: {
            retry: 0, // Don't retry mutations
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export { queryClient } from './query-client';
