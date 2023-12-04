import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import DeleteUserSection from "./DeleteUserSection";

const AdminPage = () => {
  const { userInfo } = useContext(UserAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.level !== "0") {
      console.log(userInfo.level);
      return navigate("/redirect");
    }
  });

  return (
    <div>
      <div>AdminPage Yo</div>
      <DeleteUserSection />
    </div>
  );
};

export default AdminPage;
