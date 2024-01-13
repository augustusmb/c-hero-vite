import { useContext, useEffect } from "react";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import ClassCardSection from "./ClassCardSection";
// import MobileBrowserNote from "./textComponents/MobileBrowserNote.jsx";
import TermsAndConditions from "./textComponents/TermsAndConditions.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
import { useQuery } from "@tanstack/react-query";
import { getUserByPhone } from "./api/user.js";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
  const { userInfo, setUserInfo } = useContext(UserAuthContext);
  const { user, isAuthenticated } = useAuth0();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["get-user-info", user?.name],
    queryFn: getUserByPhone,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      setUserInfo(data.data[0]);
    }
  }, [data, setUserInfo]);

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div className="grid lg:grid-cols-2">
      <div>
        <UserInfoSection userInfo={userInfo} />
      </div>
      <div>
        {userInfo?.terms_accepted ? (
          <ClassCardSection />
        ) : (
          <TermsAndConditions userId={userInfo.id} />
        )}
      </div>
      {/* <div className="mb-16 flex justify-start">
        <MobileBrowserNote />
      </div> */}
    </div>
  );
};

export default HomePage;
