import {
  useQuery,
  type QueryFunction,
  type QueryKey,
} from "@tanstack/react-query";

interface IProps<TData, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TData, TQueryKey>;
}

export function useFetch<TData, TQueryKey extends QueryKey = QueryKey>({
  queryKey,
  queryFn,
}: IProps<TData, TQueryKey>) {
  return useQuery<TData, Error, TData, TQueryKey>({
    queryKey,
    queryFn,
  });
}
