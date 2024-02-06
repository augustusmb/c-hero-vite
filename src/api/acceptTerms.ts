//@ts-nocheck

import apiClient from "./apiClient"

export const acceptTermsAndConditions = async (userId) => {
  return await apiClient.put("api/routes/users/terms", { params: { userId } })
}