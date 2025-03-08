export type QueryConfig = {
  suspense?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
};

export type MutationConfig<TData = unknown, TError = Error, TVariables = unknown> = {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
};
