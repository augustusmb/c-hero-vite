import apiClient from "./apiClient";

type CompletedTestData = {
  classId: string
  name: string
  phone: string
  userId: number
  questionsMissed: any

}

export const getTestQuestions = async (params: { queryKey: string[] }) => {
  const classId = params.queryKey[1]
  const result = await apiClient.get("/api/routes/questions", { params: { classId } })
  
  return result
}

export const submitCompletedTest = async (completedTestData: CompletedTestData) => {
  await apiClient.post("/api/routes/submit-test", { params: { completedTestData } })
}