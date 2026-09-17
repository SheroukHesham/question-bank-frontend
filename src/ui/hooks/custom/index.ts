import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunction,
  type MutationKey,
  type QueryFunction,
  type QueryKey,
} from "@tanstack/react-query";

interface IFetchProps<TData, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TData, TQueryKey>;
}

export function useFetch<TData, TQueryKey extends QueryKey = QueryKey>({
  queryKey,
  queryFn,
}: IFetchProps<TData, TQueryKey>) {
  return useQuery<TData, Error, TData, TQueryKey>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // keep unused cache for 30 minutes
  });
}

interface IMutationProps<
  TData,
  TMutationKey extends MutationKey = MutationKey,
  TQueryKey extends QueryKey = QueryKey,
> {
  mutationKey: TMutationKey;
  mutationFn: MutationFunction<TData, TMutationKey>;
  invalidateKey: TQueryKey;
}

export function useMutate<
  TData,
  TMutationKey extends MutationKey = MutationKey,
  TQueryKey extends QueryKey = QueryKey,
>({
  mutationFn,
  mutationKey,
  invalidateKey,
}: IMutationProps<TData, TMutationKey, TQueryKey>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    mutationKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  });
}
