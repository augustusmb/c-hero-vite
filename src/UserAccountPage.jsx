import { useEffect, useState, useContext } from "react";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const UserAccountPage = () => {
  const [usersClasses, setUsersClasses] = useState([]);
  const { userInfo, toggleEditMode } = useContext(UserAuthContext);
  const { user, isLoading } = useAuth0();

  useEffect(() => {
    user &&
      axios
        .get("/api/routes/classes", { params: { id: userInfo.id } })
        .then((res) => {
          setUsersClasses(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [userInfo, user]);

  if (isLoading || !user) {
    return <div>Login to view your account info</div>;
  }

  return (
    <div>
      <div>
        <div>
          <h2>Account Info</h2>
          <UserInfoSection
            userInfo={userInfo}
            toggleEditMode={toggleEditMode}
          />
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;
