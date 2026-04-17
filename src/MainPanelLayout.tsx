import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import BeatLoader from "react-spinners/BeatLoader";
import HeaderNavigation from "./HeaderNavigation.tsx";
import MainPanelRouter from "./MainPanelRouter.tsx";
import AuthLayout from "./AuthLayout.tsx";
import { setAuthToken } from "./api/apiClient.ts";
import { getUserByPhone } from "./api/user.ts";
import { UserType } from "./types/types.ts";
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";

type LoggedInUserContextType = {
  loggedInUserInfo: UserType | null;
  setLoggedInUserInfo: (user: any) => void;
};

export const LoggedInUserContext =
  createContext<LoggedInUserContextType | null>(null);

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <BeatLoader color="#123abc" loading={true} size={15} />
  </div>
);

const MainPanelLayout = () => {
  const [loggedInUserInfo, setLoggedInUserInfo] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const token = await getAccessTokenSilently();
        setAuthToken(token);
        setTokenReady(true);
      })();
    } else {
      setTokenReady(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error,
  } = useQuery({
    queryKey: [QueryKeys.GET_USER, user?.name ?? ""],
    queryFn: getUserByPhone,
    enabled:
      !authLoading && Boolean(user?.name) && isAuthenticated && tokenReady,
  });

  useEffect(() => {
    if (userData) {
      setLoggedInUserInfo(userData.data[0]);
    }
  }, [userData]);

  const renderBody = () => {
    if (authLoading) return <PageLoader />;
    if (!isAuthenticated) {
      return (
        <div className="mx-auto mt-4 text-2xl lg:w-1/2">
          <AuthLayout />
        </div>
      );
    }
    if (userLoading) return <PageLoader />;
    if (userError) {
      return (
        <div className="mx-auto mt-8 max-w-md text-center text-slate-700">
          {`${strings["common.error"]}: ${error.message}`}
        </div>
      );
    }
    return <MainPanelRouter />;
  };

  return (
    <Router>
      <LoggedInUserContext.Provider
        value={{ loggedInUserInfo, setLoggedInUserInfo }}
      >
        <div>
          <HeaderNavigation />
        </div>
        <div>{renderBody()}</div>
      </LoggedInUserContext.Provider>
    </Router>
  );
};

export default MainPanelLayout;
