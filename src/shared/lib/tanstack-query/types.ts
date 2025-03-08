export type QueryConfig = {
  suspense?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
};
