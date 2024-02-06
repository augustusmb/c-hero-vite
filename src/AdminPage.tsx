//@ts-nocheck

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "./MainPanelLayout.js";
import AdminEditUserStatic from "./AdminEditUserStatic.js";
import AdminEditUserForm from "./AdminEditUserForm.js";
import AdminUserInfoTable from "./AdminUserInfoTable.jsx";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/user.ts";
import { UserType } from "./types/types.ts";

interface UserAuthContextType {
  userInfo: UserType;
  token: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { userInfo, token } = useContext<UserAuthContextType>(UserAuthContext);
  const [userToEdit, setUserToEdit] = useState<UserType>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    level: "",
    title: "",
    company: "",
    vessel: "",
    port: "",
    terms_accepted: false,
  });
  const [editMode, setEditMode] = useState(false);

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

  const handleUserToEdit = (user: UserType) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    if (!userToEdit.name) {
      alert("Please first select a user to edit from the table below.");
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
      <div className="col-span-3">
        <AdminUserInfoTable handleUserToEdit={handleUserToEdit} />
      </div>
    </div>
  );
};

export default AdminPage;
