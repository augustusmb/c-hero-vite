import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfoAndProducts, deleteUser } from "./api/user.ts";
import { labels } from "./messages.ts";
import {
  UserType,
  UserProducts,
  FormattedUserFormData,
  RawUserFormData,
} from "./types/types.ts";
import { compareProducts, createUserInfo } from "./utils/AdminPageUtils.ts";

interface AdminEditUserStaticProps {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProducts;
  handleUserToEdit: (userToEdit: UserType) => void;
}

const AdminEditUserForm: React.FC<AdminEditUserStaticProps> = ({
  userInfo: userToEdit,
  toggleEditMode,
  editMode,
  data: userProductData,
  handleUserToEdit,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { handleSubmit, register } = useForm<RawUserFormData>();
  const queryClient = useQueryClient();

  const updateUserInfoMutation = useMutation({
    mutationFn: async (formattedUserFormData: FormattedUserFormData) => {
      updateUserInfoAndProducts(formattedUserFormData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      queryClient.invalidateQueries({ queryKey: ["get-user-products"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleDeleteUser = () => {
    toast.success(`${userToEdit.name} has been deleted from the database.`);
    deleteUserMutation.mutate(userToEdit.id);
    handleUserToEdit({
      id: 0,
      name: "",
      email: "",
      phone: "",
      level: "",
      title: "",
      company: "",
      vessel: "",
      port: "",
      terms_accepted: false,
    });
  };

  const onSubmit = (formData: RawUserFormData) => {
    const { newlyAddedProducts, newlyRemovedProducts } = compareProducts(
      userProductData,
      formData,
    );
    const formattedUserFormData = createUserInfo(
      formData,
      userToEdit,
      newlyAddedProducts,
      newlyRemovedProducts,
    );

    toast.success(`${userToEdit.name}'s account has been updated.`);
    updateUserInfoMutation.mutate(formattedUserFormData);
    handleUserToEdit(Object.assign({}, userToEdit, formattedUserFormData));
  };

  return (
    <div>
      <div className="grid grid-cols-3">
        <div className="col-span-3">
          <form
            className="grid grid-cols-1 lg:grid-cols-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-span-2 flex flex-col">
              <h3 className="mb-3 self-start text-lg font-bold underline lg:text-xl">
                Account Info
              </h3>
              <div className="grid h-60 grid-cols-4">
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
                      {...register(label as keyof RawUserFormData)}
                      placeholder={userToEdit[label]}
                      className="w-4/5 text-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col">
              <h3 className="mb-3 self-start text-lg font-bold underline lg:text-xl">
                Account Assigned Products
              </h3>
              <div className="col-span-3 flex flex-col items-start">
                {Object.values(userProductData).map((product) => {
                  return (
                    <div key={product.productId}>
                      <label
                        htmlFor={product.productId}
                        className="text-md italic text-slate-700 lg:text-lg"
                      >
                        <input
                          type="checkbox"
                          id={product.productId}
                          defaultChecked={product.assigned}
                          {...register(
                            `assignedProductChange.${product.productId}`,
                          )}
                          className="accent-orange-500"
                        />
                        {` ${product.productName}`}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-span-2 mt-3 flex items-start gap-1 lg:mt-0">
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
                    className="text-slate-950 w-36 rounded bg-orange-050 px-3 py-1 font-semibold hover:bg-orange-200 hover:text-orange-600"
                    onClick={() => handleDeleteUser()}
                  >
                    Confirm Delete
                  </p>
                ) : (
                  <p
                    className="hover:border-slate-950 w-36 rounded border border-slate-400 bg-slate-050 px-3 py-1 font-semibold text-orange-500 hover:bg-orange-100 hover:text-orange-700"
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

export default AdminEditUserForm;
