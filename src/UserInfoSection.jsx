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
        <h3 className="text-lg font-semibold underline lg:text-xl">
          Account Info
        </h3>
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
                  className="text-slate-950 w-20 rounded border border-slate-500 bg-slate-050 px-3 py-1 font-semibold hover:border-transparent hover:bg-slate-600 hover:text-slate-050"
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
