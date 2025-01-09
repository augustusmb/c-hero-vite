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
} from "./SignUpConfig";
import { PhoneInput } from "./PhoneInput";

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
        <h1 className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
          C-Hero Training Sign Up
        </h1>
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
        <div className="flex flex-col gap-2 pb-2 pt-4">
          <label className="inline-block border-b-2 border-blue-500 pb-2 text-3xl font-semibold text-gray-900">
            Rescue Poles:
          </label>
          <p className="mb-4 max-w-2xl text-lg italic leading-relaxed text-gray-600">
            Our 4 Rescue Poles differ in how the strap is attached to the Hoop.
            <br />
            Choose ONE of the following Rescue Poles:
          </p>
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            {rescuePoleOptions.map((item) => (
              <div
                key={item.value}
                className="flex flex-col items-center gap-2 rounded-lg border p-4"
              >
                <label htmlFor={item.value} className="text-center font-medium">
                  {item.label}
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <input
                    {...register("rescuePole")}
                    type="radio"
                    value={item.value}
                    id={item.value}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
          {errors.rescuePole && (
            <p className={errorStyles}>{errors.rescuePole.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 py-2">
          <label className="inline-block border-b-2 border-blue-500 pb-2 text-3xl font-semibold text-gray-900">
            Rescue Davit Mounting:
          </label>
          <p className="mb-4 max-w-2xl text-lg italic leading-relaxed text-gray-600">
            The Davits can be mounted in 2 ways. <br />
            Choose ONE of the following mounts:
          </p>
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            {rescueDavitMountingOptions.map((item) => (
              <div
                key={item.value}
                className="flex flex-col items-center gap-2 rounded-lg border p-4"
              >
                <label htmlFor={item.value} className="text-center font-medium">
                  {item.label}
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <input
                    {...register("rescueDavitMount")}
                    type="radio"
                    value={item.value}
                    id={item.value}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
          {errors.rescueDavitMount && (
            <p className={errorStyles}>{errors.rescueDavitMount.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 pb-2 pt-2">
          <label className="inline-block border-b-2 border-blue-500 pb-2 text-3xl font-semibold text-gray-900">
            Rescue Davits:
          </label>
          <p className="mb-4 max-w-2xl text-lg italic leading-relaxed text-gray-600">
            The 4 Davit types differ in how the winch plate is attached to the
            davit base. <br />
            Choose ONE of the following Rescue Davits:
          </p>
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            {rescueDavitOptions.map((item) => (
              <div
                key={item.value}
                className="flex flex-col items-center gap-2 rounded-lg border p-4"
              >
                <label htmlFor={item.value} className="text-center font-medium">
                  {item.label}
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <input
                    {...register("rescueDavit")}
                    type="radio"
                    value={item.value}
                    id={item.value}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
          {errors.rescueDavit && (
            <p className={errorStyles}>{errors.rescueDavit.message}</p>
          )}
        </div>
        <div className="flex items-start gap-4">
          <input
            {...register("consentSMS")}
            type="checkbox"
            id="consentSMS"
            className="mt-1.5 h-10 w-10 scale-125 cursor-pointer rounded border-2 border-gray-300 text-blue-600"
          />
          <label
            htmlFor="consentSMS"
            className="text-sm leading-relaxed text-gray-600"
          >
            By checking this box and signing up, I consent to receive text
            messages to my phone number that will be used for logging into the
            c-herotraining.com website (via 4 digit code sent from Twilio)
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
