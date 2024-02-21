import apiClient from "./apiClient";

export const acceptTermsAndConditions = async (userId: number) => {
  return await apiClient.put("api/routes/users/terms", { params: { userId } });
};
