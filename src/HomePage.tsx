import ClassCardSection from "./ClassCardSection.tsx";
import TermsAndConditions from "./textComponents/TermsAndConditions.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import DashboardProgressSection from "./DashboardProgressSection.tsx";
import ProductSerialNumberSection from "./ProductSerialNumberSection.tsx";

const HomePage = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="order-2 flex flex-col gap-6 lg:order-1 lg:col-span-2">
        {loggedInUserInfo && <UserInfoSection userInfo={loggedInUserInfo} />}
        <ProductSerialNumberSection />
      </div>
      <div className="order-1 lg:order-2 lg:col-span-3">
        {loggedInUserInfo?.terms_accepted ? (
          <ClassCardSection />
        ) : (
          <TermsAndConditions userId={loggedInUserInfo?.id || 0} />
        )}
      </div>
      <div className="order-3 lg:col-span-5">
        <DashboardProgressSection />
      </div>
    </div>
  );
};

export default HomePage;
