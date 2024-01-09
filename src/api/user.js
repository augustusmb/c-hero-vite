import apiClient from "./apiClient";

export const fetchUserClasses = async (userId) => {
  const usersClasses = await apiClient.get(`api/routes/classes`, {
    params: { userId },
  })

  return usersClasses; 
  // [{product_id: '3b_c', user_id: 24, completed: false, date_completed: null}, {}...]
}

export const getUserByPhone = async (params) => {
  const phone = params.queryKey[1]
  return await apiClient.get("api/routes/users", { params: { phone } })
}

export const fetchAllUsers = async () => {
  const users = await apiClient.get(`api/routes/fetch-all-users`);

  return users;
};

export const updateUserInfo = async (updatedUserInfo) => {
  return await apiClient.put("api/routes/users", { params: updatedUserInfo })
};

export const updateUserInfoAndProducts = async (updatedUserInfo) => {
  return await apiClient.put("api/routes/users-products", { params: updatedUserInfo })
};

export const deleteUser = async (userId) => {  
  return await apiClient.delete("/api/routes/users", {
    params: { userId: userId },
  });
}