import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import BeatLoader from "react-spinners/BeatLoader";
import HeaderNavigation from "./HeaderNavigation.tsx";
import MainPanelRouter from "./MainPanelRouter.tsx";
import SignUpPage from "./components/SignUpForm/SignUpPage.tsx";
import { setAuthToken } from "./api/apiClient.ts";
import { getUserByPhone } from "./api/user.ts";
import { UserType } from "./types/types.ts";
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";

type LoggedInUserContextType = {
  loggedInUserInfo: UserType | null;
};

export const LoggedInUserContext =
  createContext<LoggedInUserContextType | null>(null);

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <BeatLoader color="#123abc" loading={true} size={15} />
  </div>
);

const MainPanelLayout = () => {
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
    isError: userError,
    error,
  } = useQuery({
    queryKey: [QueryKeys.GET_USER, user?.name ?? ""],
    queryFn: getUserByPhone,
    enabled:
      !authLoading && Boolean(user?.name) && isAuthenticated && tokenReady,
  });

  const loggedInUserInfo: UserType | null = userData?.data?.[0] ?? null;

  const renderBody = () => {
    if (authLoading) return <PageLoader />;
    if (!isAuthenticated) {
      return (
        <div className="mx-auto mt-4 lg:w-1/2">
          <SignUpPage />
        </div>
      );
    }
    if (userError) {
      return (
        <div className="mx-auto mt-8 max-w-md text-center text-slate-700">
          {`${strings["common.error"]}: ${error.message}`}
        </div>
      );
    }
    if (!loggedInUserInfo) return <PageLoader />;
    return <MainPanelRouter />;
  };

  return (
    <Router>
      <LoggedInUserContext.Provider value={{ loggedInUserInfo }}>
        <div>
          <HeaderNavigation />
        </div>
        <div>{renderBody()}</div>
      </LoggedInUserContext.Provider>
    </Router>
  );
};

export default MainPanelLayout;
