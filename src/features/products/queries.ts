import { queryOptions } from "@tanstack/react-query";
import { getProducts } from "./api.ts";

export const productsKeys = {
  all: ["products"] as const,
  list: () => [...productsKeys.all, "list"] as const,
};

export const productsQuery = () =>
  queryOptions({
    queryKey: productsKeys.list(),
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60,
  });
