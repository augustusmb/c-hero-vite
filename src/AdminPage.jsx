import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import AdminEditUserStatic from "./AdminEditUserStatic.jsx";
import AdminEditUserForm from "./AdminEditUserForm.jsx";
import AdminUserInfoTable from "./AdminUserInfoTable.jsx";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/user.js";

const AdminPage = () => {
  const navigate = useNavigate();
  const { userInfo, token } = useContext(UserAuthContext);
  const [userToEdit, setUserToEdit] = useState({});
  const [editMode, setEditMode] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (userInfo?.level !== "0") {
      return navigate("/redirect");
    }
  }, [userToEdit, userInfo, navigate, token]);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["get-user-products", userToEdit.id],
    queryFn: getFullUserProductProgressMap,
  });

  if (isLoading) return <span>Loading...</span>;

  if (isError) return <span>Error: {error.message}</span>;

  const handleUserToEdit = (user) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    if (!userToEdit.name) {
      alert("Please first select a user to edit from the table below.");
      return;
    }
    setEditMode(!editMode);
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-3 mb-10">
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
      <AdminUserInfoTable handleUserToEdit={handleUserToEdit} />
    </div>
  );
};

export default AdminPage;
