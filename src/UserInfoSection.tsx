import { useState } from "react";
import UserInfoStatic from "./UserInfoStatic.jsx";
import UserInfoEdit from "./UserInfoEdit.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { UserType } from "./types/types.ts";
import { QueryKeys } from "./utils/QueryKeys";
import { fetchOptions } from "./api/signUp";
import { useQuery } from "@tanstack/react-query";

type UserInfoSectionStaticProps = {
  userInfo: UserType;
};

type TSelect = {
  name: string;
  id: number;
};

const UserInfoSection: React.FC<UserInfoSectionStaticProps> = ({
  userInfo,
}) => {
  const { user, isLoading: isAuthLoading } = useAuth0();
  const [editMode, setEditMode] = useState(false);
  const [userInfoToEdit, setUserToEdit] = useState(userInfo);

  if (isAuthLoading || !user) {
    return <div>Login to view your account info</div>;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.FORM_OPTIONS],
    queryFn: fetchOptions,
  });

  const handleUserToEdit = (user: UserType) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const companies =
    data?.data?.companies?.map((company: TSelect) => ({
      value: company.id,
      label: company.name,
    })) || [];
  const ports =
    data?.data?.ports?.map((port: TSelect) => ({
      value: port.id,
      label: port.name,
    })) || [];
  const vessels =
    data?.data?.vessels?.map((vessel: TSelect) => ({
      value: vessel.id,
      label: vessel.name,
    })) || [];

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
              companies={companies}
              ports={ports}
              vessels={vessels}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoSection;
