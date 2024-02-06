//@ts-nocheck

import { useState } from "react";
import UserInfoStatic from "./UserInfoStatic.jsx";
import UserInfoEdit from "./UserInfoEdit.jsx";
import { useAuth0 } from "@auth0/auth0-react";

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
      <div className="flex flex-col">
        <h3 className="mb-2 self-start text-lg font-semibold text-slate-900 underline lg:text-xl">
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
              <div className="mb-8 flex">
                <button
                  className="text-slate-950 h-9 w-24 rounded border border-slate-500 bg-slate-050 font-semibold hover:border-transparent hover:bg-slate-600 hover:text-slate-050"
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

export default UserInfoSection;
