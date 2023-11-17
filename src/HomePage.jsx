import ClassCardSection from "./ClassCardSection";
import DeleteUserSection from "./DeleteUserSection";
import MobileBrowserNote from "./MobileBrowserNote";
import TermsAndConditions from "./TermsAndConditions";
import UserAccountPage from "./UserAccountPage";

const HomePage = () => {
  return (
    <div>
      <div className="grid grid-cols-2 mb-16">
        <UserAccountPage />
        <DeleteUserSection />
      </div>
      <div className="flex justify-start mb-16">
        <TermsAndConditions />
      </div>
      <div className="flex justify-start mb-16">
        <MobileBrowserNote />
      </div>
      <ClassCardSection />
    </div>
  );
};

export default HomePage;
