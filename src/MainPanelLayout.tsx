import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import HeaderNavigation from "./HeaderNavigation.tsx";
import MainPanelRouter from "./MainPanelRouter.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { setAuthToken } from "./api/apiClient.ts";
import { UserType } from "./types/types.ts";
import { strings } from "./utils/strings.ts";

type LoggedInUserContextType = {
  loggedInUserInfo: UserType | null;
  setLoggedInUserInfo: (user: any) => void;
};

export const LoggedInUserContext =
  createContext<LoggedInUserContextType | null>(null);

const MainPanelLayout = () => {
  const [loggedInUserInfo, setLoggedInUserInfo] = useState(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

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
      <LoggedInUserContext.Provider
        value={{ loggedInUserInfo, setLoggedInUserInfo }}
      >
        <div>
          <HeaderNavigation />
        </div>
        <div>
          {isAuthenticated ? (
            <MainPanelRouter />
          ) : (
            <div className="mt-10 text-2xl italic">
              {strings["please.login"]}
            </div>
          )}
        </div>
      </LoggedInUserContext.Provider>
    </Router>
  );
};

export default MainPanelLayout;
