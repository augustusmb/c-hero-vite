import { useContext } from "react";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import ClassCardSection from "./ClassCardSection";
import DeleteUserSection from "./DeleteUserSection";
import MobileBrowserNote from "./MobileBrowserNote";
import TermsAndConditions from "./TermsAndConditions";
import UserAccountPage from "./UserAccountPage";
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
      <div className="grid grid-cols-2 mb-16">
        <UserAccountPage />
        {userInfo?.level === "0" && <DeleteUserSection />}
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
