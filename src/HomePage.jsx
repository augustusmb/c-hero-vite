import { useContext, useEffect } from "react";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import ClassCardSection from "./ClassCardSection";
import MobileBrowserNote from "./textComponents/MobileBrowserNote.jsx";
import TermsAndConditions from "./textComponents/TermsAndConditions.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserByPhone } from "./api/user.js";
import { useAuth0 } from "@auth0/auth0-react";

import axios from "axios";

const HomePage = () => {
  const { userInfo, setUserInfo } = useContext(UserAuthContext);
  const { user, isAuthenticated } = useAuth0();
  console.log("🚀 ~ HomePage ~ user:", user);

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

  const acceptTermsMutation = useMutation({
    mutationFn: (userId) => {
      axios.put("api/routes/users/terms", {
        params: { userId },
      });
    },
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div>
      <div className="mb-16 mt-2 lg:mt-4">
        <UserInfoSection userInfo={userInfo} />
      </div>
      {!userInfo?.terms_accepted && (
        <div className="mb-16 flex justify-center">
          <TermsAndConditions
            acceptTermsMutation={acceptTermsMutation}
            userId={userInfo.id}
          />
        </div>
      )}
      <div className="mb-16 flex justify-start">
        <MobileBrowserNote />
      </div>
      {userInfo?.terms_accepted && <ClassCardSection />}
    </div>
  );
};

export default HomePage;
