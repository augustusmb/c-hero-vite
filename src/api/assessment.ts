import apiClient from "./apiClient";
import { CompletedAssessmentData } from "../features/assessment/types";

export const getAssessmentQuestions = async (params: {
  queryKey: string[];
}) => {
  const classId = params.queryKey[1];
  const result = await apiClient.get("/api/routes/questions", {
    params: { classId },
  });

  return result;
};

export const submitCompletedAssessment = async (
  completedAssessmentData: CompletedAssessmentData,
) => {
  const submittedAssessmentData = await apiClient.post(
    "/api/routes/submit-assessment",
    {
      params: { completedAssessmentData },
    },
  );

  return submittedAssessmentData;
};
