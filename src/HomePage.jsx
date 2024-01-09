import { useContext } from "react";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import ClassCardSection from "./ClassCardSection";
import MobileBrowserNote from "./textComponents/MobileBrowserNote.jsx";
import TermsAndConditions from "./textComponents/TermsAndConditions.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const HomePage = () => {
  const { userInfo } = useContext(UserAuthContext);

  const acceptTermsMutation = useMutation({
    mutationFn: (userId) => {
      axios.put("api/routes/users/terms", {
        params: { userId },
      });
    },
  });

  return (
    <div>
      <div className="mb-16 mt-6">
        <UserInfoSection userInfo={userInfo} />
      </div>
      {!userInfo?.terms_accepted && (
        <div className="flex justify-center mb-16">
          <TermsAndConditions
            acceptTermsMutation={acceptTermsMutation}
            userId={userInfo.id}
          />
        </div>
      )}
      <div className="flex justify-start mb-16">
        <MobileBrowserNote />
      </div>
      {userInfo?.terms_accepted && <ClassCardSection />}
    </div>
  );
};

export default HomePage;
