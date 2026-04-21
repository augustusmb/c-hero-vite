import apiClient from "../../../api/apiClient.ts";
import { AdminQuestion, AdminQuestionPayload } from "./types.ts";

const BASE = "api/routes/admin/questions";

export const listAdminQuestions = async (): Promise<AdminQuestion[]> => {
  const { data } = await apiClient.get<AdminQuestion[]>(BASE);
  return data;
};

export const createAdminQuestion = async (
  payload: AdminQuestionPayload,
): Promise<AdminQuestion> => {
  const { data } = await apiClient.post<AdminQuestion>(BASE, payload);
  return data;
};

export const updateAdminQuestion = async (
  id: number,
  payload: AdminQuestionPayload,
): Promise<AdminQuestion> => {
  const { data } = await apiClient.put<AdminQuestion>(`${BASE}/${id}`, payload);
  return data;
};

export const deleteAdminQuestion = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE}/${id}`);
};
