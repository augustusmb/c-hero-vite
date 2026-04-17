import { useState } from "react";
import { Pencil } from "lucide-react";
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

  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.FORM_OPTIONS],
    queryFn: fetchOptions,
  });

  if (isAuthLoading || !user) {
    return (
      <Card>
        <SectionHeader />
        <p className="py-6 text-center text-slate-600">
          Login to view your account info
        </p>
      </Card>
    );
  }

  const handleUserToEdit = (user: UserType) => {
    setUserToEdit(user);
    setEditMode(false);
  };

  const toggleEditMode = () => setEditMode(!editMode);

  if (error) {
    return (
      <Card>
        <SectionHeader />
        <p className="py-6 text-center text-red-600">
          Error loading form options: {error.message}
        </p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <SectionHeader />
        <UserInfoSkeleton />
      </Card>
    );
  }

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
    <Card>
      <SectionHeader
        action={
          !editMode ? (
            <button
              onClick={toggleEditMode}
              aria-label="Edit account info"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <Pencil className="h-4 w-4" />
            </button>
          ) : null
        }
      />
      {!editMode ? (
        <UserInfoStatic userInfoToEdit={userInfoToEdit} />
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
    </Card>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-5">
    {children}
  </div>
);

const SectionHeader = ({ action }: { action?: React.ReactNode }) => (
  <div className="mb-4 flex items-center justify-between">
    <h4 className="text-xl font-semibold text-slate-900 lg:text-2xl">
      Account Info
    </h4>
    {action}
  </div>
);

const UserInfoSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div>
      <div className="h-7 w-48 animate-pulse rounded bg-slate-200 lg:h-8" />
      <div className="mt-2 h-5 w-20 animate-pulse rounded-full bg-slate-200" />
    </div>
    <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
      <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
      <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
    </div>
    <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
      <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
      <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
      <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
    </div>
  </div>
);

export default UserInfoSection;
