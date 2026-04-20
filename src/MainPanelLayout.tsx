import { useEffect, createContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import BeatLoader from "react-spinners/BeatLoader";
import HeaderNavigation from "./components/HeaderNavigation.tsx";
import MainPanelRouter from "./MainPanelRouter.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { registerAuthTokenGetter } from "./api/apiClient.ts";
import { userByPhoneQuery } from "./features/user/queries.ts";
import { UserType } from "./types/types.ts";
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
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    registerAuthTokenGetter(
      isAuthenticated ? () => getAccessTokenSilently() : null,
    );
  }, [isAuthenticated, getAccessTokenSilently]);

  const phone = user?.name ?? "";
  const {
    data: userData,
    isError: userError,
    error,
  } = useQuery({
    ...userByPhoneQuery(phone),
    enabled: !authLoading && Boolean(phone) && isAuthenticated,
  });

  const loggedInUserInfo: UserType | null = userData?.[0] ?? null;

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
