import axios from "axios";

export const getTestQuestions = async (params) => {
  const classId = params.queryKey[1]
  console.log('classId: ', classId)
  const result = await axios.get("/api/routes/questions", { params: { classId } })
  
  return result
}