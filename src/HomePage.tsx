import { useEffect } from "react";
import ClassCardSection from "./ClassCardSection.tsx";
import TermsAndConditions from "./textComponents/TermsAndConditions.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
import { useQuery } from "@tanstack/react-query";
import { getUserByPhone } from "./api/user.ts";
import { useAuth0 } from "@auth0/auth0-react";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import DashboardProgressSection from "./DashboardProgressSection.tsx";

const HomePage = () => {
  const { loggedInUserInfo, setLoggedInUserInfo } = useLoggedInUserContext();
  const { isLoading: authLoading, user, isAuthenticated } = useAuth0();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["get-user-info", user?.name ?? ""],
    queryFn: getUserByPhone,
    enabled: !authLoading && Boolean(user?.name) && isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      setLoggedInUserInfo(data.data[0]);
    }
  }, [data, setLoggedInUserInfo]);

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    /*  */
    <div className="grid lg:grid-cols-2">
      <div>
        {loggedInUserInfo && <UserInfoSection userInfo={loggedInUserInfo} />}
      </div>
      <div>
        {loggedInUserInfo?.terms_accepted ? (
          <ClassCardSection />
        ) : (
          <TermsAndConditions userId={loggedInUserInfo?.id || 0} />
        )}
      </div>
      <div className="col-span-2">
        <DashboardProgressSection />
      </div>
      {/* <div className="mb-16 flex justify-start">
        <MobileBrowserNote />
      </div> */}
    </div>
  );
};

export default HomePage;
