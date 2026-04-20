import { useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUserInfoAndProducts, deleteUser } from "../../../api/user.ts";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { UserType } from "../../../types/types.ts";
import { RawUserFormData } from "../types.ts";
import { UserProducts } from "../../classes/types.ts";
import { compareProducts } from "../utils.ts";
import { userKeys } from "../../user/queries.ts";
import { signUpFormOptionsQuery } from "../../signup/queries.ts";
import { strings } from "../../../utils/strings.ts";
import { Trash2 } from "lucide-react";
import {
  positionOptions,
  TCreateableSelectOption,
  TCreateableSelectOptions,
} from "../../signup/components/SignUpConfig.tsx";
import { PhoneInput } from "../../signup/components/PhoneInput.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AdminEditUserFormProps = {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProducts;
  handleUserToEdit: (userToEdit: UserType) => void;
};

type TSelect = {
  name: string;
  id: number;
};

const labelStyles = "mb-1 block text-sm font-medium text-slate-700";
const inputStyles =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
const sectionHeadingStyles =
  "text-xs font-semibold uppercase tracking-wide text-slate-500";

const selectStyles = {
  placeholder: (provided: any) => ({ ...provided, textAlign: "left" as const }),
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: "0.375rem",
    borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
    boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
    "&:hover": { borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB" },
    minHeight: "38px",
    fontSize: "0.875rem",
  }),
};

const AdminEditUserForm: React.FC<AdminEditUserFormProps> = ({
  userInfo: userToEdit,
  toggleEditMode,
  editMode,
  data: userProductData,
  handleUserToEdit,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { handleSubmit, register, control } = useForm();
  const queryClient = useQueryClient();

  const { data: optionsData, isLoading: optionsLoading } = useQuery(
    signUpFormOptionsQuery(),
  );

  const companies: TCreateableSelectOptions =
    optionsData?.companies?.map((c: TSelect) => ({
      value: c.id,
      label: c.name,
    })) || [];
  const vessels: TCreateableSelectOptions =
    optionsData?.vessels?.map((v: TSelect) => ({
      value: v.id,
      label: v.name,
    })) || [];
  const ports: TCreateableSelectOptions =
    optionsData?.ports?.map((p: TSelect) => ({
      value: p.id,
      label: p.name,
    })) || [];

  const updateUserInfoMutation = useMutation({
    mutationFn: updateUserInfoAndProducts,
    onError: () => {
      toast.error("Could not save changes. Please try again.");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: userKeys.productProgress(variables.id),
        });
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });

  const handleDeleteUser = () => {
    setShowDeleteDialog(false);
    toast.success(
      `${userToEdit.first_name} ${userToEdit.last_name} has been deleted.`,
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
      company: "",
      vessel: "",
      vessel_id: 0,
      company_id: 0,
      port_id: 0,
      port: "",
      terms_accepted: false,
    });
  };

  const onSubmit = (formData: any) => {
    const { newlyAddedProducts, newlyRemovedProducts } = compareProducts(
      userProductData,
      { assignedProductChange: formData.assignedProductChange || {} } as RawUserFormData,
    );

    const payload = {
      id: userToEdit.id,
      first_name: formData.first_name || userToEdit.first_name,
      last_name: formData.last_name || userToEdit.last_name,
      email: formData.email || userToEdit.email,
      phone: formData.phone || userToEdit.phone,
      position: formData.position || (userToEdit.position
        ? {
            value: userToEdit.position,
            label: positionOptions.find((p) => p.value === userToEdit.position)?.label || userToEdit.position,
          }
        : null),
      company: formData.company || (userToEdit.company
        ? { value: userToEdit.company_id, label: userToEdit.company }
        : null),
      vessel: formData.vessel || (userToEdit.vessel
        ? { value: userToEdit.vessel_id, label: userToEdit.vessel }
        : null),
      port: formData.port || (userToEdit.port
        ? { value: userToEdit.port_id, label: userToEdit.port }
        : null),
      newlyAddedProducts,
      newlyRemovedProducts,
    };

    updateUserInfoMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(
          `${payload.first_name} ${payload.last_name}'s account has been updated.`,
        );
        handleUserToEdit({
          ...userToEdit,
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email,
          phone: payload.phone,
          company: payload.company?.label || userToEdit.company,
          company_id:
            typeof payload.company?.value === "number"
              ? payload.company.value
              : userToEdit.company_id,
          vessel: payload.vessel?.label || userToEdit.vessel,
          vessel_id:
            typeof payload.vessel?.value === "number"
              ? payload.vessel.value
              : userToEdit.vessel_id,
          port: payload.port?.label || userToEdit.port,
          port_id:
            typeof payload.port?.value === "number"
              ? payload.port.value
              : userToEdit.port_id,
          position: payload.position?.value || userToEdit.position,
        });
      },
    });
  };

  const assignedProducts = Object.values(userProductData).filter(
    (p) => p.assigned,
  );
  const unassignedProducts = Object.values(userProductData).filter(
    (p) => !p.assigned,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 lg:text-2xl">
          Edit User
        </h3>
        <button
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete user
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <section className="flex flex-col gap-3">
              <h4 className={sectionHeadingStyles}>Personal</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="admin_first_name" className={labelStyles}>
                    First name
                  </label>
                  <input
                    id="admin_first_name"
                    {...register("first_name")}
                    defaultValue={userToEdit.first_name}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="admin_last_name" className={labelStyles}>
                    Last name
                  </label>
                  <input
                    id="admin_last_name"
                    {...register("last_name")}
                    defaultValue={userToEdit.last_name}
                    className={inputStyles}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="admin_email" className={labelStyles}>
                    Email
                  </label>
                  <input
                    id="admin_email"
                    {...register("email")}
                    defaultValue={userToEdit.email}
                    type="email"
                    className={inputStyles}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="admin_phone" className={labelStyles}>
                    Phone
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue={userToEdit.phone}
                    render={({ field }) => (
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-3 border-t border-slate-200 pt-5">
              <h4 className={sectionHeadingStyles}>Work</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <label className={labelStyles}>Position</label>
                  <Controller
                    name="position"
                    control={control}
                    defaultValue={
                      userToEdit.position
                        ? {
                            value: userToEdit.position,
                            label:
                              positionOptions.find(
                                (p) => p.value === userToEdit.position,
                              )?.label || userToEdit.position,
                          }
                        : null
                    }
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={positionOptions}
                        placeholder="Select position"
                        styles={selectStyles}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Company</label>
                  <Controller
                    name="company"
                    control={control}
                    defaultValue={
                      userToEdit.company
                        ? {
                            value: userToEdit.company_id,
                            label: userToEdit.company,
                          }
                        : null
                    }
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        placeholder="Select or create company"
                        isClearable
                        options={companies}
                        isLoading={optionsLoading}
                        isValidNewOption={(inputValue) =>
                          companies.filter((option: TCreateableSelectOption) =>
                            option.label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()),
                          ).length === 0
                        }
                        styles={selectStyles}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Vessel</label>
                  <Controller
                    name="vessel"
                    control={control}
                    defaultValue={
                      userToEdit.vessel
                        ? {
                            value: userToEdit.vessel_id,
                            label: userToEdit.vessel,
                          }
                        : null
                    }
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        placeholder="Select or create vessel"
                        isClearable
                        options={vessels}
                        isLoading={optionsLoading}
                        isValidNewOption={(inputValue) =>
                          vessels.filter((option: TCreateableSelectOption) =>
                            option.label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()),
                          ).length === 0
                        }
                        styles={selectStyles}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Port</label>
                  <Controller
                    name="port"
                    control={control}
                    defaultValue={
                      userToEdit.port
                        ? { value: userToEdit.port_id, label: userToEdit.port }
                        : null
                    }
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        placeholder="Select or create port"
                        isClearable
                        options={ports}
                        isLoading={optionsLoading}
                        isValidNewOption={(inputValue) =>
                          ports.filter((option: TCreateableSelectOption) =>
                            option.label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()),
                          ).length === 0
                        }
                        styles={selectStyles}
                      />
                    )}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-5 border-t border-slate-200 pt-5 lg:col-span-2 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <section className="flex flex-col gap-3">
              <h4 className={sectionHeadingStyles}>Assigned Products</h4>
              <div className="flex flex-col gap-2">
                {assignedProducts.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {assignedProducts.map((product) => (
                      <label
                        key={product.productId}
                        className="flex cursor-pointer items-center gap-2.5 rounded-md border border-green-200 bg-green-050 px-3 py-2 text-sm transition-colors hover:bg-green-100"
                      >
                        <input
                          type="checkbox"
                          id={product.productId}
                          defaultChecked={true}
                          {...register(
                            `assignedProductChange.${product.productId}`,
                          )}
                          className="h-4 w-4 accent-orange-500"
                        />
                        <span className="font-medium text-slate-800">
                          {product.productName}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {unassignedProducts.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {assignedProducts.length > 0 && (
                      <div className="my-1 border-t border-slate-200" />
                    )}
                    {unassignedProducts.map((product) => (
                      <label
                        key={product.productId}
                        className="flex cursor-pointer items-center gap-2.5 rounded-md border border-slate-200 bg-slate-050 px-3 py-2 text-sm transition-colors hover:bg-slate-100"
                      >
                        <input
                          type="checkbox"
                          id={product.productId}
                          defaultChecked={false}
                          {...register(
                            `assignedProductChange.${product.productId}`,
                          )}
                          className="h-4 w-4 accent-orange-500"
                        />
                        <span className="text-slate-600">
                          {product.productName}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => toggleEditMode(!editMode)}
            className="rounded-md border border-slate-300 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {strings["common.cancel"]}
          </button>
          <button
            type="submit"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Save Changes
          </button>
        </div>
      </form>

      <Dialog
        open={showDeleteDialog}
        onOpenChange={(open) => setShowDeleteDialog(open)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {userToEdit.first_name} {userToEdit.last_name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteDialog(false)}
              className="rounded-md border border-slate-300 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEditUserForm;
