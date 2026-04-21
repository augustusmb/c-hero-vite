import { queryOptions } from "@tanstack/react-query";
import { listAdminQuestions } from "./api.ts";

export const adminQuestionsKeys = {
  all: ["admin", "questions"] as const,
  list: () => [...adminQuestionsKeys.all, "list"] as const,
};

export const adminQuestionsQuery = () =>
  queryOptions({
    queryKey: adminQuestionsKeys.list(),
    queryFn: listAdminQuestions,
  });
