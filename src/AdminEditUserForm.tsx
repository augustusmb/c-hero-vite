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
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";

type AdminEditUserStaticProps = {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProducts;
  handleUserToEdit: (userToEdit: UserType) => void;
};

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
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LIST_USERS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST_USER_PRODUCTS],
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LIST_USERS] });
    },
  });

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleDeleteUser = () => {
    toast.success(
      `${userToEdit.first_name} ${userToEdit.last_name} has been deleted from the database.`,
    );
    deleteUserMutation.mutate(userToEdit.id);
    handleUserToEdit({
      id: 0,
      name: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      level: "",
      title: "",
      company: "",
      vessel: "",
      vessel_id: 0,
      company_id: 0,
      port_id: 0,
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

    toast.success(
      `${userToEdit?.first_name} ${userToEdit?.last_name}'s account has been updated.`,
    );
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
              <h3 className="mb-3 self-start text-lg font-bold underline lg:text-3xl">
                {strings["account.info"]}
              </h3>
              <div className="grid h-60 grid-cols-4">
                <div className="flex flex-col items-start">
                  {labels.map((item) => (
                    <label
                      htmlFor={item.value}
                      key={item.value}
                      className="text-lg"
                    >
                      {item.label}:
                    </label>
                  ))}
                </div>
                <div className="col-span-3 flex flex-col items-start">
                  {labels.map((item) => (
                    <input
                      key={item.value}
                      {...register(item.value as keyof RawUserFormData)}
                      placeholder={userToEdit[item.value]}
                      className="w-4/5 text-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col">
              <h3 className="mb-3 self-start text-lg font-bold underline lg:text-3xl">
                {strings["account.assigned.products"]}
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
                className="w-36 rounded border border-blue-500 bg-transparent px-3 py-1 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                onClick={() => toggleEditMode(!editMode)}
              >
                {strings["common.cancel"]}
              </p>
              <input
                className="w-36 rounded border border-slate-500 bg-slate-700 px-3 py-1 font-semibold text-slate-050 hover:border-transparent hover:bg-slate-600 hover:text-slate-100"
                type="submit"
                value="Save Changes"
              />
              <div>
                {confirmDelete ? (
                  <p
                    className="w-36 rounded bg-orange-050 px-3 py-1 font-semibold text-slate-950 hover:bg-orange-200 hover:text-orange-600"
                    onClick={() => handleDeleteUser()}
                  >
                    {strings["common.confirm.delete"]}
                  </p>
                ) : (
                  <p
                    className="w-36 rounded border border-slate-400 bg-slate-050 px-3 py-1 font-semibold text-orange-500 hover:border-slate-950 hover:bg-orange-100 hover:text-orange-700"
                    onClick={() => toggleConfirmDelete()}
                  >
                    {strings["common.delete"]}
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
