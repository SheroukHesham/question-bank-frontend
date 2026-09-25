import { SidebarContext } from "@/ui/context/SideBarContext";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunction,
  type MutationKey,
  type QueryBooleanOption,
  type QueryFunction,
  type QueryKey,
} from "@tanstack/react-query";
import * as React from "react";

interface IFetchProps<TData, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TData, TQueryKey>;
  enabled?: QueryBooleanOption<TData, Error, TData, TQueryKey> | undefined;
}

export function useFetch<TData, TQueryKey extends QueryKey = QueryKey>({
  queryKey,
  queryFn,
  enabled,
}: IFetchProps<TData, TQueryKey>) {
  return useQuery<TData, Error, TData, TQueryKey>({
    queryKey,
    queryFn,
    enabled,
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
export function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}
