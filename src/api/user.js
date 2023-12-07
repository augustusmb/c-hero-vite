import axios from "axios";


export const fetchUserClasses = async (userId) => {
  const usersClasses = await axios.get(`api/routes/classes`, {
    params: { userId: userId },
  })

  return usersClasses; 
  // [{product_id: '3b_c', user_id: 24, completed: false, date_completed: null}, {}...]
}

export const fetchAllUsers = async () => {
  console.log('All users fetched')
  const users = await axios.get(`api/routes/all-user-overview`);

  return users;
};

export const updateUserInfo = (updatedUserInfo) => {
  return axios.put("api/routes/users", { params: updatedUserInfo })
};