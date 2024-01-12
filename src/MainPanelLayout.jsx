import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import HeaderNavigation from "./HeaderNavigation.jsx";
import MainPanelRouter from "./MainPanelRouter.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { setAuthToken } from "./api/apiClient.js";
export const UserAuthContext = React.createContext();

const MainPanelLayout = () => {
  const [userInfo, setUserInfo] = useState({});
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const userInfoContext = { userInfo, setUserInfo };

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const token = await getAccessTokenSilently();
        setAuthToken(token);
      })();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return (
    <Router>
      <UserAuthContext.Provider value={userInfoContext}>
        <div>
          <HeaderNavigation />
        </div>
        <div>
          {isAuthenticated ? (
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
