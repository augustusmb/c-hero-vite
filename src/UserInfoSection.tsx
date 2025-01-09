import { useState } from "react";
import UserInfoStatic from "./UserInfoStatic.jsx";
import UserInfoEdit from "./UserInfoEdit.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { UserType } from "./types/types.ts";

type UserInfoSectionStaticProps = {
  userInfo: UserType;
};

const UserInfoSection: React.FC<UserInfoSectionStaticProps> = ({
  userInfo,
}) => {
  const { user, isLoading } = useAuth0();
  const [editMode, setEditMode] = useState(false);
  const [userInfoToEdit, setUserToEdit] = useState(userInfo);

  if (isLoading || !user) {
    return <div>Login to view your account info</div>;
  }

  const handleUserToEdit = (user: UserType) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="col-span-1">
      <div className="flex flex-col">
        <h4 className="mb-2 self-start text-xl font-semibold text-slate-900 underline lg:text-3xl">
          Account Info
        </h4>
        <div>
          {!editMode ? (
            <>
              <UserInfoStatic userInfoToEdit={userInfoToEdit} />
              <div className="mb-8 flex">
                <button
                  disabled
                  className="h-9 w-24 rounded border border-slate-500 bg-slate-050 font-semibold text-slate-950 
  hover:border-transparent hover:bg-slate-600 hover:text-slate-050
  disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-50 
  disabled:hover:border-slate-500 disabled:hover:bg-slate-200 disabled:hover:text-slate-500"
                  onClick={() => toggleEditMode()}
                >
                  Edit
                </button>
              </div>
            </>
          ) : (
            <UserInfoEdit
              userInfoToEdit={userInfoToEdit}
              handleUserToEdit={handleUserToEdit}
              toggleEditMode={toggleEditMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoSection;
