import { useEffect } from "react";
import ClassCardSection from "./ClassCardSection.tsx";
import TermsAndConditions from "./textComponents/TermsAndConditions.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
import { useQuery } from "@tanstack/react-query";
import { getUserByPhone } from "./api/user.ts";
import { useAuth0 } from "@auth0/auth0-react";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import DashboardProgressSection from "./DashboardProgressSection.tsx";
import BeatLoader from "react-spinners/BeatLoader";
import ProductSerialNumberSection from "./ProductSerialNumberSection.tsx";
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";

const HomePage = () => {
  const { loggedInUserInfo, setLoggedInUserInfo } = useLoggedInUserContext();
  const { isLoading: authLoading, user, isAuthenticated } = useAuth0();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKeys.GET_USER, user?.name ?? ""],
    queryFn: getUserByPhone,
    enabled: !authLoading && Boolean(user?.name) && isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      setLoggedInUserInfo(data.data[0]);
    }
  }, [data, setLoggedInUserInfo]);

  if (isLoading) return <BeatLoader color="#123abc" loading={true} size={15} />;
  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  return (
    /*  */
    <div className="grid gap-2 lg:grid-cols-2">
      <div>
        {loggedInUserInfo && <UserInfoSection userInfo={loggedInUserInfo} />}
        <ProductSerialNumberSection />
      </div>
      <div>
        {loggedInUserInfo?.terms_accepted ? (
          <ClassCardSection />
        ) : (
          <TermsAndConditions userId={loggedInUserInfo?.id || 0} />
        )}
      </div>
      <div className="lg:col-span-2">
        <DashboardProgressSection />
      </div>
      {/* <div className="mb-16 flex justify-start">
        <MobileBrowserNote />
      </div> */}
    </div>
  );
};

export default HomePage;
