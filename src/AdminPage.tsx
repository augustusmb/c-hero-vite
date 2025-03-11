import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import AdminEditUserStatic from "./AdminEditUserStatic.js";
import AdminEditUserForm from "./AdminEditUserForm.js";
import AdminUserInfoTable from "./AdminUserInfoTable.js";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/user.ts";
import { UserType } from "./types/types.ts";
import BeatLoader from "react-spinners/BeatLoader";
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";

const AdminPage = () => {
  const navigate = useNavigate();
  const { loggedInUserInfo } = useLoggedInUserContext();
  const [userToEdit, setUserToEdit] = useState<UserType>({
    id: 0,
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    level: "",
    title: "",
    company: "",
    vessel_id: 0,
    company_id: 0,
    port_id: 0,
    vessel: "",
    port: "",
    terms_accepted: false,
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (loggedInUserInfo?.level !== "0") {
      return navigate("/redirect");
    }
  }, [userToEdit, loggedInUserInfo, navigate]);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKeys.LIST_USER_PRODUCTS, userToEdit.id],
    queryFn: getFullUserProductProgressMap,
  });

  if (isLoading) return <BeatLoader color="#123abc" loading={true} size={15} />;
  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  const handleUserToEdit = (user: UserType) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    if (!userToEdit.first_name)
      toast.error("Please first select a user to edit from the table below.");
    else setEditMode(!editMode);
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
