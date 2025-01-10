import { useForm, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rescueDavitOptions,
  rescueDavitMountingOptions,
  rescuePoleOptions,
  positionOptions,
  signUpSchema,
  inputStyles,
  errorStyles,
  TSignUpSchema,
  TCreateableSelectOptions,
  TCreateableSelectOption,
  RescuePoleType,
  RescueDavitMountType,
  RescueDavitType,
} from "./SignUpConfig";
import { PhoneInput } from "./PhoneInput";
import { RadioImageGroup } from "./RadioImageGroup";
import { strings } from "../../utils/strings";

type SignUpFormProps = {
  companies: TCreateableSelectOptions;
  ports: TCreateableSelectOptions;
  vessels: TCreateableSelectOptions;
  signUpUserMutation: (data: TSignUpSchema) => void;
  setActiveTab: (tab: string) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  companies,
  ports,
  vessels,
  signUpUserMutation,
  setActiveTab,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      company: null,
      port: null,
      vessel: null,
      position: null,
    },
  });

  const onSubmit = async (data: TSignUpSchema) => {
    try {
      await signUpUserMutation(data);
      reset();
      setActiveTab("login");
    } catch (error) {
      console.error("Form Submission error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        className="flex flex-col gap-y-2 p-4 lg:p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
            Welcome to C-Hero eTraining
          </h1>
          <p className="mb-4 text-center text-gray-600">
            Please sign up below,
            <br />
            or{" "}
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => setActiveTab("login")}
            >
              login
            </span>{" "}
            if you are returning.
          </p>
        </div>
        <input
          {...register("firstName")}
          placeholder="First name"
          type="text"
          className={`${inputStyles} ${
            errors.firstName ? "border-red-500" : ""
          }`}
        ></input>
        {errors.firstName && (
          <p className={errorStyles}>{errors.firstName.message}</p>
        )}
        <input
          {...register("lastName")}
          placeholder="Last name"
          type="text"
          className={`${inputStyles} ${
            errors.lastName ? "border-red-500" : ""
          }`}
        ></input>
        {errors.lastName && (
          <p className={errorStyles}>{errors.lastName.message}</p>
        )}
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className={`${inputStyles} ${errors.email ? "border-red-500" : ""}`}
        ></input>
        {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
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
        {errors.phone && <p className={errorStyles}>{errors.phone.message}</p>}{" "}
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
              }}
            />
          )}
        />
        {errors.company && (
          <p className={errorStyles}>{errors.company.message}</p>
        )}
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
              }}
            />
          )}
        />
        {errors.port && <p className={errorStyles}>{errors.port.message}</p>}
        <Controller
          name="vessel"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              placeholder="Vessel"
              className="bg-blue-300"
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
        <RadioImageGroup<RescuePoleType>
          title={strings["rescuePole.title"]}
          description={strings["rescuePole.description"]}
          options={rescuePoleOptions}
          name="rescuePole"
          selected={watch("rescuePole")}
          onSelect={(value) => setValue("rescuePole", value)}
          error={errors.rescuePole?.message}
        />
        <RadioImageGroup<RescueDavitMountType>
          title={strings["rescueDavitMount.title"]}
          description={strings["rescueDavitMount.description"]}
          options={rescueDavitMountingOptions}
          name="rescueDavitMount"
          selected={watch("rescueDavitMount")}
          onSelect={(value) => setValue("rescueDavitMount", value)}
          error={errors.rescueDavitMount?.message}
        />
        <RadioImageGroup<RescueDavitType>
          title={strings["rescueDavit.title"]}
          description={strings["rescueDavit.description"]}
          options={rescueDavitOptions}
          name="rescueDavit"
          selected={watch("rescueDavit")}
          onSelect={(value) => setValue("rescueDavit", value)}
          error={errors.rescueDavit?.message}
        />
        <div className="flex items-start gap-4">
          <input
            {...register("consentSMS")}
            type="checkbox"
            id="consentSMS"
            className="mt-1.5 h-10 w-10 scale-125 cursor-pointer rounded border-2 border-gray-300 text-blue-600"
          />
          <label
            htmlFor="consentSMS"
            className="text-left text-sm leading-relaxed text-gray-600"
          >
            {strings["sms.consent"]}
          </label>
        </div>
        {errors.consentSMS && (
          <p className={errorStyles}>{errors.consentSMS.message}</p>
        )}
        <input
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
        ></input>
      </form>
    </div>
  );
};

export default SignUpForm;
