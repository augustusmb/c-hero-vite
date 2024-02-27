import apiClient from "./apiClient.ts";
import { FormattedUserFormData, UpdatedUserInfo } from "../types/types.ts";

export const fetchUserClasses = async (userId: number) => {
  const usersClasses = await apiClient.get(`api/routes/classes`, {
    params: { userId },
  });

  return usersClasses;
  // [{product_id: '3b_c', user_id: 24, completed: false, date_completed: null}, {}...]
};

export const getUserByPhone = async (params: { queryKey: string[] }) => {
  const phone = params.queryKey[1];
  return await apiClient.get("api/routes/users", { params: { phone } });
};

export const fetchAllUsers = async () => {
  const users = await apiClient.get(`api/routes/fetch-all-users`);

  return users;
};

export const updateUserInfo = async (updatedUserInfo: UpdatedUserInfo) => {
  return await apiClient.put("api/routes/users", { params: updatedUserInfo });
};

export const updateUserInfoAndProducts = async (
  updatedUserInfoProducts: FormattedUserFormData,
) => {
  return await apiClient.put("api/routes/users-products", {
    params: updatedUserInfoProducts,
  });
};

export const deleteUser = async (userId: number) => {
  return await apiClient.delete("api/routes/users", {
    params: { userId: userId },
  });
};

export const getDashboardUsers = async ({ queryKey }: any) => {
  const [_key, level, id, vessel, company] = queryKey;

  const users = await apiClient.get(`api/routes/dashboard`, {
    params: { level, id, vessel, company },
  });

  console.log("users: ", users);

  return users;
};
