import apiClient from "./apiClient";

export const acceptTermsAndConditions = async (userId: number) => {
  const { data } = await apiClient.put("api/routes/users/terms", {
    params: { userId },
  });
  return data;
};
