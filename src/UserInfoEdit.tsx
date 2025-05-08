import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "./api/user.ts";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserType, UpdatedUserInfo } from "./types/types.ts";
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { z } from "zod";
import {
  inputStyles,
  errorStyles,
  positionOptions,
  TCreateableSelectOptions,
  TCreateableSelectOption,
} from "./components/SignUpForm/SignUpConfig";
import { PhoneInput } from "./components/SignUpForm/PhoneInput";

type UserInfoEditProps = {
  toggleEditMode: () => void;
  userInfoToEdit: UserType;
  handleUserToEdit: (userToEdit: UserType) => void;
  companies: TCreateableSelectOptions;
  ports: TCreateableSelectOptions;
  vessels: TCreateableSelectOptions;
};

// Define a schema for the form validation
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

const UserInfoEdit: React.FC<UserInfoEditProps> = ({
  userInfoToEdit: user,
  toggleEditMode,
  handleUserToEdit,
  companies,
  ports,
  vessels,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log("user", user);

  // Split name into firstName and lastName for the form
  const { first_name, last_name } = user;

  // Convert user data to form format
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

  const updateUserInfoMutation = useMutation({
    mutationFn: async (updatedUserInfo: UpdatedUserInfo) => {
      console.log("Mutation called with:", updatedUserInfo);
      return updateUserInfo(updatedUserInfo);
    },
    onMutate: async (updatedUserInfo) => {
      console.log("onMutate called with:", updatedUserInfo);

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.GET_USER, updatedUserInfo.phone],
      });
      await queryClient.cancelQueries({ queryKey: [QueryKeys.LIST_USERS] });

      // Snapshot the previous values
      const previousUserData = queryClient.getQueryData([
        QueryKeys.GET_USER,
        updatedUserInfo.phone,
      ]);
      const previousListData = queryClient.getQueryData([QueryKeys.LIST_USERS]);

      console.log("Previous user data:", previousUserData);
      console.log("Previous list data:", previousListData);

      // Optimistically update the user data
      if (previousUserData) {
        const newUserData = {
          data: [
            {
              ...user,
              first_name: updatedUserInfo.first_name,
              last_name: updatedUserInfo.last_name,
              email: updatedUserInfo.email,
              phone: updatedUserInfo.phone,
              company: updatedUserInfo.company?.label || user.company,
              company_id: updatedUserInfo.company?.value || user.company_id,
              vessel: updatedUserInfo.vessel?.label || user.vessel,
              vessel_id: updatedUserInfo.vessel?.value || user.vessel_id,
              port: updatedUserInfo.port?.label || user.port,
              port_id: updatedUserInfo.port?.value || user.port_id,
              position: updatedUserInfo.position?.value || user.position,
            },
          ],
        };
        console.log("Setting optimistic user data:", newUserData);

        queryClient.setQueryData(
          [QueryKeys.GET_USER, updatedUserInfo.phone],
          newUserData,
        );
      } else {
        console.log("No previous user data found to update optimistically");
      }

      // Optionally update the list of users if it exists in the cache
      if (previousListData) {
        console.log("Updating user list data optimistically");
        queryClient.setQueryData([QueryKeys.LIST_USERS], (old: any) => {
          if (!old || !old.data) {
            console.log("List data is invalid or missing data array");
            return old;
          }
          const updatedList = {
            ...old,
            data: old.data.map((u: UserType) =>
              u.id === updatedUserInfo.id
                ? {
                    ...u,
                    first_name: updatedUserInfo.first_name,
                    last_name: updatedUserInfo.last_name,
                    email: updatedUserInfo.email,
                    phone: updatedUserInfo.phone,
                    company: updatedUserInfo.company?.label || u.company,
                    company_id: updatedUserInfo.company?.value || u.company_id,
                    vessel: updatedUserInfo.vessel?.label || u.vessel,
                    vessel_id: updatedUserInfo.vessel?.value || u.vessel_id,
                    port: updatedUserInfo.port?.label || u.port,
                    port_id: updatedUserInfo.port?.value || u.port_id,
                    position: updatedUserInfo.position?.value || u.position,
                  }
                : u,
            ),
          };
          console.log("Updated list data:", updatedList);
          return updatedList;
        });
      } else {
        console.log("No previous list data found to update optimistically");
      }

      // Return the snapshots so we can rollback if something goes wrong
      return { previousUserData, previousListData };
    },
    onSuccess: (result) => {
      console.log("Mutation succeeded:", result);
    },
    onError: (err, updatedUserInfo, context) => {
      console.log("Mutation error:", err);
      console.log("Rolling back to previous data");

      // If the mutation fails, roll back to the previous values
      if (context?.previousUserData) {
        queryClient.setQueryData(
          [QueryKeys.GET_USER, updatedUserInfo.phone],
          context.previousUserData,
        );
      }

      if (context?.previousListData) {
        queryClient.setQueryData(
          [QueryKeys.LIST_USERS],
          context.previousListData,
        );
      }

      console.error("Error updating user info:", err);
    },
    onSettled: (_data, _error, variables) => {
      console.log("Mutation settled, invalidating queries");

      // Always refetch after error or success to ensure our local data is in sync with the server
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_USER, variables.phone],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LIST_USERS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST_USER_PRODUCTS],
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

    // Log the userInfo being sent to the mutation
    console.log("Submitting form with userInfo:", userInfo);

    updateUserInfoMutation.mutate(userInfo, {
      onSuccess: () => {
        console.log("Navigation after successful mutation");
        toggleEditMode();
        handleUserToEdit(Object.assign({}, user, userInfo));
        navigate("/home");
      },
    });
  };

  return (
    <form
      className="flex flex-col gap-y-2 p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-3/4 flex-col gap-y-2">
        {/* First Name Field */}
        <input
          {...register("firstName")}
          placeholder="First name"
          type="text"
          className={`${inputStyles} ${
            errors.firstName ? "border-red-500" : ""
          }`}
        />
        {errors.firstName && (
          <p className={errorStyles}>{errors.firstName.message}</p>
        )}

        {/* Last Name Field */}
        <input
          {...register("lastName")}
          placeholder="Last name"
          type="text"
          className={`${inputStyles} ${
            errors.lastName ? "border-red-500" : ""
          }`}
        />
        {errors.lastName && (
          <p className={errorStyles}>{errors.lastName.message}</p>
        )}

        {/* Email Field */}
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className={`${inputStyles} ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && <p className={errorStyles}>{errors.email.message}</p>}

        {/* Phone Field */}
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
        {errors.phone && <p className={errorStyles}>{errors.phone.message}</p>}

        {/* Company Field */}
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              placeholder="Company"
              isClearable
              options={companies}
              isValidNewOption={(inputValue) => {
                const filteredOptions = companies.filter(
                  (option: TCreateableSelectOption) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
                );
                return filteredOptions.length === 0;
              }}
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: "0.375rem",
                  borderColor: "#D1D5DB",
                }),
              }}
            />
          )}
        />
        {errors.company && (
          <p className={errorStyles}>{errors.company.message}</p>
        )}

        {/* Port Field */}
        <Controller
          name="port"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              placeholder="Port"
              isClearable
              options={ports}
              isValidNewOption={(inputValue) => {
                const filteredOptions = ports.filter(
                  (option: TCreateableSelectOption) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
                );
                return filteredOptions.length === 0;
              }}
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: "0.375rem",
                  borderColor: "#D1D5DB",
                }),
              }}
            />
          )}
        />
        {errors.port && <p className={errorStyles}>{errors.port.message}</p>}

        {/* Vessel Field */}
        <Controller
          name="vessel"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              placeholder="Vessel"
              isClearable
              options={vessels}
              isValidNewOption={(inputValue) => {
                const filteredOptions = vessels.filter(
                  (option: TCreateableSelectOption) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
                );
                return filteredOptions.length === 0;
              }}
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: "0.375rem",
                  borderColor: "#D1D5DB",
                }),
              }}
            />
          )}
        />
        {errors.vessel && (
          <p className={errorStyles}>{errors.vessel.message}</p>
        )}

        {/* Position Field */}
        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={positionOptions}
              placeholder="Position"
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: "0.375rem",
                  borderColor: "#D1D5DB",
                }),
              }}
            />
          )}
        />
        {errors.position && (
          <p className={errorStyles}>{errors.position.message}</p>
        )}
      </div>

      <div className="mt-4 flex w-3/4 items-center space-x-4">
        <button
          type="button"
          className="h-9 w-24 rounded border border-blue-500 bg-transparent font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
          onClick={toggleEditMode}
        >
          {strings["common.cancel"]}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-9 w-24 rounded border border-slate-500 bg-slate-700 font-semibold text-slate-050 hover:border-transparent hover:bg-slate-600 hover:text-slate-100 disabled:bg-slate-300"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UserInfoEdit;
