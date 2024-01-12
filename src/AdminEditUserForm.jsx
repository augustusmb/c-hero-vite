import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfoAndProducts, deleteUser } from "./api/user.js";
import { labels } from "./messages.js";

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
      queryClient.invalidateQueries(["get-user-products"]);
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
    navigate("/admin");
  };

  const onSubmit = (data) => {
    // compare newly assigned products to already assigned products
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

    // alert(`${user.name}'s account has been updated.`);
    updateUserInfoMutation.mutate(userInfo);
    handleUserToEdit(Object.assign({}, user, userInfo));
  };

  return (
    <div>
      <div className="grid grid-cols-3">
        <div className="col-span-3">
          <form
            className="grid grid-cols-1 lg:grid-cols-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-2 mb-6 flex flex-col">
              <h3 className="self-start text-lg font-bold underline lg:text-xl">
                Account Info
              </h3>
              <div className="grid grid-cols-4">
                <div className="flex flex-col items-start">
                  {labels.map((label) => (
                    <label htmlFor={label} key={label}>
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
                      className="w-4/5"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col">
              <h3 className="self-start text-lg font-bold underline lg:text-xl">
                Account Assigned Products
              </h3>
              <div className="col-span-3 flex flex-col items-start">
                {Object.values(userProductData).map((product) => {
                  return (
                    <div key={product.productId}>
                      <label className="text-md italic text-slate-700 lg:text-lg">
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
            <div className="col-span-2 mt-4 flex justify-center gap-1">
              <p
                className="hover:bg-blue-500 text-blue-700 hover:text-white border-blue-500 w-36 rounded border bg-transparent px-3 py-1 font-semibold hover:border-transparent"
                onClick={() => toggleEditMode(!editMode)}
              >
                Cancel
              </p>
              <input
                className="w-36 rounded border border-slate-500 bg-slate-700 px-3 py-1 font-semibold text-slate-050 hover:border-transparent hover:bg-slate-600 hover:text-slate-100"
                type="submit"
                value="Save Changes"
              />
              <div>
                {confirmDelete ? (
                  <p
                    className="text-slate-950 hover:text-orange-950 w-36 rounded bg-orange-100 px-3 py-1 font-semibold hover:bg-orange-200"
                    onClick={() => handleDeleteUser()}
                  >
                    Confirm Delete
                  </p>
                ) : (
                  <p
                    className="hover:border-slate-950 hover:text-orange-950 w-36 rounded border border-slate-400 bg-slate-050 px-3 py-1 font-semibold text-orange-800 hover:bg-orange-100"
                    onClick={() => toggleConfirmDelete()}
                  >
                    Delete User
                  </p>
                )}
              </div>
            </div>
            <div></div>
          </form>
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
