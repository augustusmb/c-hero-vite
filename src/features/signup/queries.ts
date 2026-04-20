import { queryOptions } from "@tanstack/react-query";
import { fetchOptions } from "../../api/signUp.ts";

export const signUpKeys = {
  all: ["signup"] as const,
  formOptions: () => [...signUpKeys.all, "formOptions"] as const,
};

export const signUpFormOptionsQuery = () =>
  queryOptions({
    queryKey: signUpKeys.formOptions(),
    queryFn: fetchOptions,
  });
