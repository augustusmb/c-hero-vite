import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import AdminViewAllUsers from "./AdminViewAllUsers.jsx";
import AdminEditUserStatic from "./AdminEditUserStatic.jsx";
import AdminEditUserForm from "./AdminEditUserForm.jsx";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/utils.js";

const AdminPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserAuthContext);
  const [userToEdit, setUserToEdit] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (userInfo?.level !== "0") {
      // Check if user is admin
      console.log(userInfo.level);
      return navigate("/redirect");
    }
  }, [userToEdit, userInfo, navigate]);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["get-user-products", userToEdit.id],
    queryFn: getFullUserProductProgressMap,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleUserToEdit = (user) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    if (!userToEdit.name) {
      alert("Please first select a user to edit from the lefthand panel.");
      return;
    }
    setEditMode(!editMode);
  };

  return (
    <div className="grid grid-cols-4">
      <AdminViewAllUsers handleUserToEdit={handleUserToEdit} />
      <div className="col-span-3">
        {!editMode ? (
          <AdminEditUserStatic
            userInfo={userToEdit}
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            data={data}
          />
        ) : (
          <AdminEditUserForm
            userInfo={userToEdit}
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            data={data}
            handleUserToEdit={handleUserToEdit}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
