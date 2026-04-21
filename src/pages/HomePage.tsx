import ClassCardSection from "../features/classes/components/ClassCardSection.tsx";
import TermsAndConditions from "../features/user/components/TermsAndConditions.tsx";
import UserInfoSection from "../features/user/components/UserInfoSection.tsx";
import { useLoggedInUserContext } from "../hooks/useLoggedInUserContext.ts";
import DashboardProgressSection from "../features/classes/components/DashboardProgressSection.tsx";
import ProductSerialNumberSection from "../features/user/components/ProductSerialNumberSection.tsx";

const HomePage = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-6 lg:order-1 lg:col-span-2">
        {loggedInUserInfo && <UserInfoSection userInfo={loggedInUserInfo} />}
        <ProductSerialNumberSection />
      </div>
      <div className="lg:order-2 lg:col-span-3">
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
