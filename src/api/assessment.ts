import apiClient from "./apiClient";
import {
  AssessmentQuestion,
  CompletedAssessmentData,
} from "../features/assessment/types";

export const getAssessmentQuestions = async (
  classId: string,
): Promise<AssessmentQuestion[]> => {
  const { data } = await apiClient.get<AssessmentQuestion[]>(
    "/api/routes/questions",
    { params: { classId } },
  );
  return data;
};

export const submitCompletedAssessment = async (
  completedAssessmentData: CompletedAssessmentData,
) => {
  const { data } = await apiClient.post("/api/routes/submit-assessment", {
    params: { completedAssessmentData },
  });
  return data;
};
