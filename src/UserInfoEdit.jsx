import { useForm } from "react-hook-form";
import { PropTypes } from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "./api/user.js";
import { useNavigate } from "react-router-dom";
import { labels } from "./messages";

const EditUserInfoSection = ({
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
      <div className="mb-16 grid h-52 grid-cols-4">
        <div className="flex flex-col items-start">
          {labels.map((label) => (
            <label htmlFor={label} key={label} className="text-lg">
              {label[0].toUpperCase() + label.slice(1)}:
            </label>
          ))}
          <button
            className="hover:bg-blue-500 text-blue-700 hover:text-white border-blue-500 ml-1 mt-3 w-24 self-end rounded border bg-transparent py-1 font-semibold hover:border-transparent"
            onClick={() => triggerEditMode()}
          >
            Cancel
          </button>
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
          <div className="grid grid-cols-3">
            <input
              className="ml-1 mt-3 w-24 rounded border border-slate-500 bg-slate-700 px-3 py-1 font-semibold text-slate-050 hover:border-transparent hover:bg-slate-600 hover:text-slate-100"
              type="submit"
              value="Save"
            />
            <p className="col-span-2 ml-4 mt-3 text-xs italic">
              Only change what is needed, rest of the values will remain.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

EditUserInfoSection.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    vessel: PropTypes.string,
    port: PropTypes.string,
    id: PropTypes.number,
  }),
  editMode: PropTypes.bool,
  handleUserToEdit: PropTypes.func,
  triggerEditMode: PropTypes.func,
};

export default EditUserInfoSection;
