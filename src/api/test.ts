import apiClient from "./apiClient";
import { CompletedTestData } from "../types/types";

export const getTestQuestions = async (params: { queryKey: string[] }) => {
  const classId = params.queryKey[1];
  const result = await apiClient.get("/api/routes/questions", {
    params: { classId },
  });

  return result;
};

export const submitCompletedTest = async (
  completedTestData: CompletedTestData,
) => {
  const submittedTestData = await apiClient.post("/api/routes/submit-test", {
    params: { completedTestData },
  });

  return submittedTestData;
};
