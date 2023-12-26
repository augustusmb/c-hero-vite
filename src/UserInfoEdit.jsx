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
      <div className="grid grid-cols-4">
        <div className="flex flex-col items-start">
          {labels.map((label) => (
            <label htmlFor={label} key={label}>
              {label[0].toUpperCase() + label.slice(1)}:
            </label>
          ))}
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => triggerEditMode()}
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-col items-start col-span-3">
          {labels.map((label) => (
            <input
              key={label}
              {...register(label)}
              placeholder={user[label]}
              className="w-4/5"
            />
          ))}
          <input
            className="bg-blue-700 hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            type="submit"
            value="Save"
          />
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
