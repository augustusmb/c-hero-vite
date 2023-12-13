import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfoAndProducts, deleteUser } from "./api/user.js";
import { labels } from "./messages";

const AdminEditUserForm = ({
  userInfo: user,
  toggleEditMode,
  editMode,
  data: userProductData,
  handleUserToEdit,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { handleSubmit, register } = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateUserInfoMutation = useMutation({
    mutationFn: (updatedUserInfo) => {
      updateUserInfoAndProducts(updatedUserInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => {
      deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
    },
  });

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleDeleteUser = () => {
    alert(`${user.name} has been deleted from the database.`);
    deleteUserMutation.mutate(user.id);
    handleUserToEdit({});
    toggleEditMode(!editMode);
    navigate("/admin");
  };

  const onSubmit = (data) => {
    // compare newly assinged products to already assigned products
    const newlyAddedProducts = {};
    const newlyRemovedProducts = {};
    for (const key in userProductData) {
      if (userProductData[key].assigned === false && data[key] === true) {
        newlyAddedProducts[key] = true;
      }
      if (userProductData[key].assigned === true && data[key] === false) {
        newlyRemovedProducts[key] = true;
      }
    }

    let userInfo = {
      name: data.name || user.name,
      email: data.email || user.email,
      title: data.title || user.title,
      company: data.company || user.company,
      vessel: data.vessel || user.vessel,
      port: data.port || user.port,
      id: user.id,
      newlyAddedProducts,
      newlyRemovedProducts,
    };

    alert(`${user.name}'s account has been updated.`);
    updateUserInfoMutation.mutate(userInfo);
    handleUserToEdit(Object.assign({}, user, userInfo));
    toggleEditMode(!editMode);
    navigate("/admin");
  };

  return (
    <div>
      <div className="grid grid-cols-6">
        <div className="col-span-5">
          <form className="grid grid-cols-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-3">
              <h3 className="font-bold underline">Account Info</h3>
              <div className="grid grid-cols-4">
                <div className="flex flex-col items-start">
                  {labels.map((label) => (
                    <label htmlFor={label} key={label}>
                      {label[0].toUpperCase() + label.slice(1)}:
                    </label>
                  ))}
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
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <h3 className="font-bold underline">Account Assigned Products</h3>
              <div className="col-span-3 flex flex-col items-start">
                {Object.values(userProductData).map((product) => {
                  return (
                    <div key={product.productId}>
                      <label>
                        <input
                          type="checkbox"
                          name={product.productId}
                          defaultChecked={product.assigned}
                          {...register(product.productId)}
                        />
                        {` ${product.productName}`}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-span-3 flex justify-end">
              <input
                className="bg-blue-700 hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                type="submit"
                value="Save Changes"
              />
            </div>
          </form>
        </div>
        <div className="col-span-1">
          <h3 className="font-bold underline">Click to Edit User</h3>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => toggleEditMode(!editMode)}
          >
            Cancel
          </button>
          <div>
            <button
              className="bg-red-500 hover:bg-red-300 text-white font-semibold hover:text-white py-2 px-4 border border-slate-800 hover:border-transparent rounded"
              onClick={() => toggleConfirmDelete()}
            >
              Delete User
            </button>
            {confirmDelete && (
              <button
                className="bg-black hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent rounded"
                onClick={() => handleDeleteUser()}
              >
                Confirm Delete User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AdminEditUserForm.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    vessel: PropTypes.string,
    port: PropTypes.string,
    id: PropTypes.number,
  }),
  toggleEditMode: PropTypes.func,
  editMode: PropTypes.bool,
  data: PropTypes.object,
  handleUserToEdit: PropTypes.func,
};

export default AdminEditUserForm;
