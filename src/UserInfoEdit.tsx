import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "./api/user.ts";
import { useNavigate } from "react-router-dom";
import { labels } from "./messages.ts";
import { UserType, UpdatedUserInfo } from "./types/types.ts";
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";

type UserInfoEditProps = {
  toggleEditMode: () => void;
  userInfoToEdit: UserType;
  handleUserToEdit: (userToEdit: UserType) => void;
};

const UserInfoEdit: React.FC<UserInfoEditProps> = ({
  userInfoToEdit: user,
  toggleEditMode,
  handleUserToEdit,
}) => {
  const { handleSubmit, register } = useForm<UpdatedUserInfo>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const updateUserInfoMutation = useMutation({
    mutationFn: async (updatedUserInfo: UpdatedUserInfo) => {
      updateUserInfo(updatedUserInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LIST_USERS] });
    },
  });

  const onSubmit = (data: UpdatedUserInfo) => {
    let userInfo = {
      name: data.name || user.name,
      email: data.email || user.email,
      title: data.title || user.title,
      company: data.company || user.company,
      vessel: data.vessel || user.vessel,
      port: data.port || user.port,
      id: user.id,
    };
    updateUserInfoMutation.mutate(userInfo);
    toggleEditMode();
    navigate("/home");
    handleUserToEdit(Object.assign(user, userInfo));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="box-shadow-lg grid h-60 grid-cols-4 rounded-lg">
        <div className="flex flex-col items-start">
          {labels.map((item) => (
            <label htmlFor={item.value} key={item.value} className="text-lg">
              {item.label}:
            </label>
          ))}
        </div>
        <div className="col-span-3 flex flex-col items-start">
          {labels.map((item) => (
            <input
              key={item.value}
              {...register(item.value as keyof UpdatedUserInfo)}
              placeholder={user[item.value]}
              className="w-4/5 text-lg"
            />
          ))}
        </div>
      </div>
      <div className="col-span-4 mb-8 flex items-start">
        <button
          className="h-9 w-24 rounded border border-blue-500 bg-transparent font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
          onClick={() => toggleEditMode()}
        >
          {strings["common.cancel"]}
        </button>
        <input
          className="ml-1 h-9 w-24 rounded border border-slate-500 bg-slate-700 font-semibold text-slate-050 hover:border-transparent hover:bg-slate-600 hover:text-slate-100"
          type="submit"
          value="Save"
        />
        <p className="lg:text-md col-span-2 ml-4 text-left text-xs italic lg:pr-8">
          {strings["only.change.needed"]}
        </p>
      </div>
    </form>
  );
};

export default UserInfoEdit;
