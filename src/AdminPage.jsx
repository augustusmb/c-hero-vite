import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import EditUserAsAdmin from "./EditUserAsAdmin.jsx";
import AdminViewAllUsers from "./AdminViewAllUsers.jsx";

const AdminPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserAuthContext);
  const [userToEdit, setUserToEdit] = useState({});

  useEffect(() => {
    if (userInfo?.level !== "0") {
      console.log(userInfo.level);
      return navigate("/redirect");
    }
  }, [userToEdit, userInfo, navigate]);

  const handleUserToEdit = (user) => {
    setUserToEdit(user);
  };

  return (
    <div className="grid grid-cols-4">
      <AdminViewAllUsers handleUserToEdit={handleUserToEdit} />
      <EditUserAsAdmin userInfo={userToEdit} userProductMap={{}} />
    </div>
  );
};

export default AdminPage;
