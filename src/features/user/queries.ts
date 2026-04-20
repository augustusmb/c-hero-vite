import { queryOptions } from "@tanstack/react-query";
import { getSerialNumbers, getUserByPhone, listUsers } from "../../api/user.ts";
import { getFullUserProductProgressMap } from "./utils.ts";

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
  byPhone: (phone: string) => [...userKeys.all, "byPhone", phone] as const,
  productProgress: (userId: number) =>
    [...userKeys.all, "productProgress", userId] as const,
  serialNumbers: (userId: number) =>
    [...userKeys.all, "serialNumbers", userId] as const,
};

export const userByPhoneQuery = (phone: string) =>
  queryOptions({
    queryKey: userKeys.byPhone(phone),
    queryFn: () => getUserByPhone(phone),
    enabled: Boolean(phone),
  });

export const userListQuery = () =>
  queryOptions({
    queryKey: userKeys.list(),
    queryFn: listUsers,
  });

export const userProductProgressQuery = (userId: number) =>
  queryOptions({
    queryKey: userKeys.productProgress(userId),
    queryFn: () => getFullUserProductProgressMap(userId),
    enabled: Boolean(userId),
  });

export const userSerialNumbersQuery = (userId: number) =>
  queryOptions({
    queryKey: userKeys.serialNumbers(userId),
    queryFn: () => getSerialNumbers(userId),
    enabled: Boolean(userId),
  });
