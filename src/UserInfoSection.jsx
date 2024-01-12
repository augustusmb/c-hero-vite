import { useState } from "react";
import UserInfoStatic from "./UserInfoStatic.jsx";
import UserInfoEdit from "./UserInfoEdit.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";

const UserInfoSection = ({ userInfo }) => {
  const { user, isLoading } = useAuth0();
  const [editMode, setEditMode] = useState(false);
  const [userInfoToEdit, setUserToEdit] = useState(userInfo);

  if (isLoading || !user) {
    return <div>Login to view your account info</div>;
  }

  const handleUserToEdit = (user) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const triggerEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="col-span-1">
      <div>
        <h3 className="text-xl font-semibold underline">Account Info</h3>
        <div>
          {!editMode ? (
            <>
              <UserInfoStatic
                userInfo={userInfo}
                editMode={editMode}
                triggerEditMode={triggerEditMode}
              />
              <div className="flex">
                <button
                  className="bg-slate-050 hover:bg-slate-600 text-slate-950 font-semibold hover:text-slate-050 py-1 px-3 border border-slate-500 hover:border-transparent rounded"
                  onClick={() => triggerEditMode()}
                >
                  Edit
                </button>
              </div>
            </>
          ) : (
            <UserInfoEdit
              userInfo={userInfo}
              editMode={editMode}
              handleUserToEdit={handleUserToEdit}
              triggerEditMode={triggerEditMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

UserInfoSection.propTypes = {
  userInfo: PropTypes.object,
  handleUserToEdit: PropTypes.func,
  editMode: PropTypes.bool,
  setEditMode: PropTypes.func,
};

export default UserInfoSection;
