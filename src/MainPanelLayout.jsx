import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import HeaderNavigation from "./HeaderNavigation.jsx";
import MainPanelRouter from "./MainPanelRouter.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserByPhone } from "./api/user.js";
import { useQuery } from "@tanstack/react-query";
import { setAuthToken } from "./api/apiClient.js";
export const UserAuthContext = React.createContext();

const MainPanelLayout = () => {
  const [userInfo, setUserInfo] = useState({});
  const { user, getAccessTokenSilently } = useAuth0();
  const token = (async () => await getAccessTokenSilently())();

  const userInfoContext = { userInfo, token };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["get-user-info", user?.name],
    queryFn: getUserByPhone,
    onSettled: (data, error) => {
      if (error) {
        console.error("Error: ", error);
      } else {
        console.log("Data: ", data);
        setUserInfo(data.data[0]);
      }
    },
    enabled: !!user?.name,
  });

  useEffect(() => {
    (async () => {
      console.log("hi2");
      const token = await getAccessTokenSilently();
      setAuthToken(token);
    })();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (data) {
      setUserInfo(data.data[0]);
    }
  }, [data]);

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <Router>
      <UserAuthContext.Provider value={userInfoContext}>
        <div>
          <HeaderNavigation />
        </div>
        <div>
          <MainPanelRouter />
        </div>
      </UserAuthContext.Provider>
    </Router>
  );
};

export default MainPanelLayout;
