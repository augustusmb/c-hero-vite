import axios from "axios";


export const fetchUserClasses = async (userId) => {
  const usersClasses = await axios.get(`api/routes/classes`, {
    params: { userId: userId },
  })

  return usersClasses; 
  // [{product_id: '3b_c', user_id: 24, completed: false, date_completed: null}, {}...]
}

export const getUserByPhone = async (phone) => {
  return await axios.get("api/routes/users", { params: phone })
}

export const fetchAllUsers = async () => {
  const users = await axios.get(`api/routes/all-user-overview`);

  return users;
};

export const updateUserInfo = async (updatedUserInfo) => {
  return await axios.put("api/routes/users", { params: updatedUserInfo })
};

export const updateUserInfoAndProducts = async (updatedUserInfo) => {
  return await axios.put("api/routes/users-products", { params: updatedUserInfo })
};

export const deleteUser = async (userId) => {  
  return await axios.delete("/api/routes/users", {
    params: { userId: userId },
  });
}