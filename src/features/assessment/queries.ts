import { queryOptions } from "@tanstack/react-query";
import { getAssessmentQuestions } from "../../api/assessment.ts";

export const assessmentKeys = {
  all: ["assessment"] as const,
  questions: (classId: string) =>
    [...assessmentKeys.all, "questions", classId] as const,
};

export const assessmentQuestionsQuery = (classId: string) =>
  queryOptions({
    queryKey: assessmentKeys.questions(classId),
    queryFn: () => getAssessmentQuestions(classId),
    enabled: Boolean(classId),
  });
