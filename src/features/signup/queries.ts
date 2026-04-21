import { queryOptions } from "@tanstack/react-query";
import { fetchOptions, checkPhoneAvailable } from "../../api/signUp.ts";

export const signUpKeys = {
  all: ["signup"] as const,
  formOptions: () => [...signUpKeys.all, "formOptions"] as const,
  phoneAvailable: (phone: string) =>
    [...signUpKeys.all, "phoneAvailable", phone] as const,
};

export const signUpFormOptionsQuery = () =>
  queryOptions({
    queryKey: signUpKeys.formOptions(),
    queryFn: fetchOptions,
  });

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

export const phoneAvailableQuery = (phone: string) =>
  queryOptions({
    queryKey: signUpKeys.phoneAvailable(phone),
    queryFn: () => checkPhoneAvailable(phone),
    enabled: PHONE_REGEX.test(phone),
    staleTime: 30_000,
  });
