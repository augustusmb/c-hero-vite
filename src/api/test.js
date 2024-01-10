import apiClient from "./apiClient";

export const getTestQuestions = async (params) => {
  const classId = params.queryKey[1]
  const result = await apiClient.get("/api/routes/questions", { params: { classId } })
  
  return result
}

export const submitCompletedTest = async (completedTestData) => {
  await apiClient.post("/api/routes/submit-test", { params: { completedTestData } })
}