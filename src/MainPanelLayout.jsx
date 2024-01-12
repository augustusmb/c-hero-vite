import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import HeaderNavigation from "./HeaderNavigation.jsx";
import MainPanelRouter from "./MainPanelRouter.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { setAuthToken } from "./api/apiClient.js";
export const UserAuthContext = React.createContext();

const MainPanelLayout = () => {
  const [userInfo, setUserInfo] = useState({});
  const { user, getAccessTokenSilently } = useAuth0();
  const [userFetched, setUserFetched] = useState(false);

  const token = (async () => await getAccessTokenSilently())();

  const userInfoContext = { userInfo, token, setUserInfo, userFetched };

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      setUserFetched(true);
    })();
  }, [getAccessTokenSilently]);

  // useEffect(() => {
  //   if (user) {
  //   }
  // }, [user]);

  return (
    <Router>
      <UserAuthContext.Provider value={userInfoContext}>
        <div>
          <HeaderNavigation />
        </div>
        <div>
          {user?.name ? (
            <MainPanelRouter />
          ) : (
            <div>Please Login to continue</div>
          )}
        </div>
      </UserAuthContext.Provider>
    </Router>
  );
};

export default MainPanelLayout;
