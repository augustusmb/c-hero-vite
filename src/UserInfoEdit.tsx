//@ts-nocheck

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "./api/user.ts";
import { useNavigate } from "react-router-dom";
import { labels } from "./messages.ts";

const UserInfoEdit = ({
  userInfo: user,
  triggerEditMode,
  editMode,
  handleUserToEdit,
}) => {
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const updateUserInfoMutation = useMutation({
    mutationFn: (updatedUserInfo) => {
      updateUserInfo(updatedUserInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
    },
  });

  const onSubmit = (data) => {
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
    triggerEditMode(!editMode);
    navigate("/home");
    handleUserToEdit(Object.assign(user, userInfo));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="box-shadow-lg grid h-60 grid-cols-4 rounded-lg">
        <div className="flex flex-col items-start">
          {labels.map((label) => (
            <label htmlFor={label} key={label} className="text-lg">
              {label[0].toUpperCase() + label.slice(1)}:
            </label>
          ))}
        </div>
        <div className="col-span-3 flex flex-col items-start">
          {labels.map((label) => (
            <input
              key={label}
              {...register(label)}
              placeholder={user[label]}
              className="w-4/5 text-lg"
            />
          ))}
        </div>
      </div>
      <div className="col-span-4 mb-8 flex items-start">
        <button
          className="hover:bg-blue-500 text-blue-700 hover:text-white border-blue-500 h-9 w-24 rounded border bg-transparent font-semibold hover:border-transparent"
          onClick={() => triggerEditMode()}
        >
          Cancel
        </button>
        <input
          className="ml-1 h-9 w-24 rounded border border-slate-500 bg-slate-700 font-semibold text-slate-050 hover:border-transparent hover:bg-slate-600 hover:text-slate-100"
          type="submit"
          value="Save"
        />
        <p className="lg:text-md col-span-2 ml-4 text-left text-xs italic lg:pr-8">
          Only change what is needed, rest of the values will remain.
        </p>
      </div>
    </form>
  );
};

export default UserInfoEdit;
