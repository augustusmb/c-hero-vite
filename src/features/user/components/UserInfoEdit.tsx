import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateUserInfo } from "../../../api/user.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserType } from "../../../types/types.ts";
import { UpdatedUserInfo } from "../types.ts";
import { userKeys } from "../queries.ts";
import { strings } from "../../../utils/strings.ts";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { z } from "zod";
import {
  inputStyles,
  errorStyles,
  positionOptions,
  TCreateableSelectOptions,
  TCreateableSelectOption,
} from "../../signup/components/SignUpConfig";
import { PhoneInput } from "../../signup/components/PhoneInput";

type UserInfoEditProps = {
  toggleEditMode: () => void;
  userInfoToEdit: UserType;
  handleUserToEdit: (userToEdit: UserType) => void;
  companies: TCreateableSelectOptions;
  ports: TCreateableSelectOptions;
  vessels: TCreateableSelectOptions;
};

const userInfoEditSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  company: z
    .object({
      value: z.union([z.string(), z.number()]),
      label: z.string(),
      __isNew__: z.boolean().optional(),
    })
    .nullable(),
  vessel: z
    .object({
      value: z.union([z.string(), z.number()]),
      label: z.string(),
      __isNew__: z.boolean().optional(),
    })
    .nullable(),
  port: z
    .object({
      value: z.union([z.string(), z.number()]),
      label: z.string(),
      __isNew__: z.boolean().optional(),
    })
    .nullable(),
  position: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable(),
});

type UserInfoFormData = z.infer<typeof userInfoEditSchema>;

const labelStyles = "mb-1 block text-sm font-medium text-slate-700";
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
    minHeight: "42px",
  }),
};

const UserInfoEdit: React.FC<UserInfoEditProps> = ({
  userInfoToEdit: user,
  toggleEditMode,
  handleUserToEdit,
  companies,
  ports,
  vessels,
}) => {
  const queryClient = useQueryClient();
  const { first_name, last_name } = user;

  const defaultValues = {
    firstName: first_name,
    lastName: last_name,
    email: user.email || "",
    phone: user.phone || "",
    company: user.company
      ? { value: user.company_id, label: user.company }
      : null,
    vessel: user.vessel ? { value: user.vessel_id, label: user.vessel } : null,
    port: user.port ? { value: user.port_id, label: user.port } : null,
    position: user.position
      ? {
          value: user.position,
          label:
            positionOptions.find((p) => p.value === user.position)?.label ||
            user.position,
        }
      : null,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoEditSchema),
    defaultValues,
  });

  const applyUpdate = (u: UserType, update: UpdatedUserInfo): UserType => ({
    ...u,
    first_name: update.first_name,
    last_name: update.last_name,
    email: update.email,
    phone: update.phone,
    company: update.company?.label || u.company,
    company_id: (update.company?.value as number) || u.company_id,
    vessel: update.vessel?.label || u.vessel,
    vessel_id: (update.vessel?.value as number) || u.vessel_id,
    port: update.port?.label || u.port,
    port_id: (update.port?.value as number) || u.port_id,
    position: (update.position?.value as string) || u.position,
  });

  const updateUserInfoMutation = useMutation({
    mutationFn: updateUserInfo,
    onMutate: async (update) => {
      const byPhoneKey = userKeys.byPhone(update.phone);
      const listKey = userKeys.list();

      await Promise.all([
        queryClient.cancelQueries({ queryKey: byPhoneKey }),
        queryClient.cancelQueries({ queryKey: listKey }),
      ]);

      const previousUserData =
        queryClient.getQueryData<UserType[]>(byPhoneKey);
      const previousListData = queryClient.getQueryData<UserType[]>(listKey);

      if (previousUserData) {
        queryClient.setQueryData<UserType[]>(byPhoneKey, [
          applyUpdate(user, update),
        ]);
      }

      if (previousListData) {
        queryClient.setQueryData<UserType[]>(listKey, (old) =>
          old?.map((u) => (u.id === update.id ? applyUpdate(u, update) : u)),
        );
      }

      return { previousUserData, previousListData };
    },
    onError: (_err, update, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(
          userKeys.byPhone(update.phone),
          context.previousUserData,
        );
      }
      if (context?.previousListData) {
        queryClient.setQueryData(userKeys.list(), context.previousListData);
      }
      toast.error("Could not save your changes. Please try again.");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.byPhone(variables.phone),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.invalidateQueries({
        queryKey: userKeys.productProgress(variables.id),
      });
    },
  });

  const onSubmit = (data: UserInfoFormData) => {
    const userInfo = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company || { label: user.company, value: user.company_id },
      vessel: data.vessel || { label: user.vessel, value: user.vessel_id },
      port: data.port || { label: user.port, value: user.port_id },
      position: data.position || user.position,
      id: user.id,
    };

    updateUserInfoMutation.mutate(userInfo, {
      onSuccess: () => {
        toast.success("Your account info has been updated.");
        handleUserToEdit({
          ...user,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company?.label || user.company,
          company_id:
            typeof data.company?.value === "number"
              ? data.company.value
              : user.company_id,
          vessel: data.vessel?.label || user.vessel,
          vessel_id:
            typeof data.vessel?.value === "number"
              ? data.vessel.value
              : user.vessel_id,
          port: data.port?.label || user.port,
          port_id:
            typeof data.port?.value === "number"
              ? data.port.value
              : user.port_id,
          position: data.position?.value || user.position,
        });
        toggleEditMode();
      },
    });
  };

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <section className="flex flex-col gap-3">
        <h5 className={sectionHeadingStyles}>Personal</h5>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={labelStyles}>
                First name
              </label>
              <input
                id="firstName"
                {...register("firstName")}
                type="text"
                className={`${inputStyles} w-full ${
                  errors.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className={errorStyles}>{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className={labelStyles}>
                Last name
              </label>
              <input
                id="lastName"
                {...register("lastName")}
                type="text"
                className={`${inputStyles} w-full ${
                  errors.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className={errorStyles}>{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelStyles}>
              Email
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              className={`${inputStyles} w-full ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className={errorStyles}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className={labelStyles}>
              Phone
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
              )}
            />
            {errors.phone && (
              <p className={errorStyles}>{errors.phone.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-slate-200 pt-5">
        <h5 className={sectionHeadingStyles}>Work</h5>
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelStyles}>Position</label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={positionOptions}
                  placeholder="Select position"
                  styles={selectStyles}
                />
              )}
            />
            {errors.position && (
              <p className={errorStyles}>{errors.position.message}</p>
            )}
          </div>

          <div>
            <label className={labelStyles}>Company</label>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  placeholder="Select or create company"
                  isClearable
                  options={companies}
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
            {errors.company && (
              <p className={errorStyles}>{errors.company.message}</p>
            )}
          </div>

          <div>
            <label className={labelStyles}>Vessel</label>
            <Controller
              name="vessel"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  placeholder="Select or create vessel"
                  isClearable
                  options={vessels}
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
            {errors.vessel && (
              <p className={errorStyles}>{errors.vessel.message}</p>
            )}
          </div>

          <div>
            <label className={labelStyles}>Port</label>
            <Controller
              name="port"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  placeholder="Select or create port"
                  isClearable
                  options={ports}
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
            {errors.port && (
              <p className={errorStyles}>{errors.port.message}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={toggleEditMode}
          className="rounded-md border border-slate-300 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {strings["common.cancel"]}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UserInfoEdit;
