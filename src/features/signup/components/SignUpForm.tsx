import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
import { ReviewStep } from "./ReviewStep";
import { strings } from "../../../utils/strings";
import { phoneAvailableQuery } from "../queries";

type SignUpFormProps = {
  companies: TCreateableSelectOptions;
  ports: TCreateableSelectOptions;
  vessels: TCreateableSelectOptions;
  signUpUserMutation: (data: TSignUpSchema) => Promise<unknown>;
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  companies,
  ports,
  vessels,
  signUpUserMutation,
}) => {
  const { loginWithRedirect } = useAuth0();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    trigger,
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
      rescuePole: null,
      rescueDavitMount: null,
      rescueDavit: null,
    },
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const phone = watch("phone") ?? "";
  const [debouncedPhone, setDebouncedPhone] = useState(phone);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPhone(phone), 400);
    return () => clearTimeout(timer);
  }, [phone]);

  const phoneAvailability = useQuery(phoneAvailableQuery(debouncedPhone));

  useEffect(() => {
    if (phoneAvailability.data?.available === false) {
      setError("phone", {
        type: "manual",
        message: "This phone number is already registered.",
      });
    } else if (phoneAvailability.data?.available === true) {
      clearErrors("phone");
    }
  }, [phoneAvailability.data, setError, clearErrors]);

  const step1Fields: Array<keyof TSignUpSchema> = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "company",
    "position",
    "port",
    "vessel",
  ];

  const step2Fields: Array<keyof TSignUpSchema> = [
    "rescuePole",
    "rescueDavit",
    "rescueDavitMount",
  ];

  const handleNext = async () => {
    const valid = await trigger(step1Fields);
    if (!valid) return;
    if (phoneAvailability.data?.available === false) {
      setError("phone", {
        type: "manual",
        message: "This phone number is already registered.",
      });
      return;
    }
    setStep(2);
  };

  const handleReview = async () => {
    const valid = await trigger(step2Fields);
    if (!valid) return;
    setStep(3);
  };

  const onSubmit = async (data: TSignUpSchema) => {
    try {
      await signUpUserMutation(data);
      reset();
      loginWithRedirect();
    } catch (error: any) {
      const status = error?.response?.status;
      const field = error?.response?.data?.field;

      if (status === 409 && field === "phone") {
        setStep(1);
        setError("phone", {
          type: "manual",
          message: "This phone number is already registered.",
        });
        toast.error(
          <div className="flex flex-col items-start gap-2">
            <span>This phone number is already registered.</span>
            <button
              type="button"
              onClick={() => loginWithRedirect()}
              className="rounded-md bg-orange-500 px-3 py-1 text-sm font-semibold text-slate-050 hover:bg-orange-600"
            >
              Log in instead
            </button>
          </div>,
          { autoClose: 8000 },
        );
        return;
      }

      console.error("Form Submission error:", error);
    }
  };

  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex justify-center">
      <form
        className="flex w-full flex-col gap-y-3 p-4 lg:p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <h1 className="mb-2 text-center text-2xl font-bold text-slate-900 lg:text-3xl">
            Welcome to C-Hero eTraining
          </h1>
          <p className="text-center text-sm text-slate-600">
            Please sign up below, or{" "}
            <button
              type="button"
              className="cursor-pointer font-medium text-blue-600 hover:underline"
              onClick={() => loginWithRedirect()}
            >
              log in
            </button>{" "}
            if you are returning.
          </p>
        </div>
        <div className="mb-4 flex items-center justify-center gap-3 sm:gap-4">
          {[
            { n: 1, label: "Your info" },
            { n: 2, label: "Equipment" },
            { n: 3, label: "Review" },
          ].map(({ n, label }, idx) => (
            <div key={n} className="flex items-center gap-2 sm:gap-3">
              {idx > 0 && <div className="h-px w-6 bg-slate-300 sm:w-12" />}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    step === n
                      ? "bg-orange-500 text-slate-050"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {n}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    step === n ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
        {step === 1 && (
          <>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelStyles}>
              First name
            </label>
            <input
              {...register("firstName")}
              id="firstName"
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
              {...register("lastName")}
              id="lastName"
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelStyles}>
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={`${inputStyles} w-full ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className={errorStyles}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className={labelStyles}>
              Phone number
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  id="phone"
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <label htmlFor="company" className={labelStyles}>
              Company
            </label>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  inputId="company"
                  placeholder="Select or type to add"
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
          </div>
          <div>
            <label htmlFor="position" className={labelStyles}>
              Position
            </label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="position"
                  options={positionOptions}
                  placeholder="Select your position"
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
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <label htmlFor="port" className={labelStyles}>
              Port
            </label>
            <Controller
              name="port"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  inputId="port"
                  placeholder="Select or type to add"
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
            {errors.port && (
              <p className={errorStyles}>{errors.port.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="vessel" className={labelStyles}>
              Vessel
            </label>
            <Controller
              name="vessel"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  inputId="vessel"
                  placeholder="Select or type to add"
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
                  }}
                />
              )}
            />
            {errors.vessel && (
              <p className={errorStyles}>{errors.vessel.message}</p>
            )}
          </div>
        </div>
            <button
              type="button"
              onClick={handleNext}
              className="mt-2 w-full rounded-md bg-orange-500 px-6 py-2.5 text-base font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600"
            >
              Next →
            </button>
          </>
        )}
        {step === 2 && (
          <>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {strings["equipment.step.helper"]}
        </div>
        <RadioImageGroup<RescuePoleType>
          title={strings["rescuePole.title"]}
          description={strings["rescuePole.description"]}
          options={rescuePoleOptions}
          name="rescuePole"
          selected={watch("rescuePole") ?? null}
          onSelect={(value) =>
            setValue("rescuePole", value, { shouldValidate: true })
          }
          error={errors.rescuePole?.message}
        />
        <RadioImageGroup<RescueDavitMountType>
          title={strings["rescueDavitMount.title"]}
          description={strings["rescueDavitMount.description"]}
          options={rescueDavitMountingOptions}
          name="rescueDavitMount"
          selected={watch("rescueDavitMount") ?? null}
          onSelect={(value) =>
            setValue("rescueDavitMount", value, { shouldValidate: true })
          }
          error={errors.rescueDavitMount?.message}
        />
        <RadioImageGroup<RescueDavitType>
          title={strings["rescueDavit.title"]}
          description={strings["rescueDavit.description"]}
          options={rescueDavitOptions}
          name="rescueDavit"
          selected={watch("rescueDavit") ?? null}
          onSelect={(value) =>
            setValue("rescueDavit", value, { shouldValidate: true })
          }
          error={errors.rescueDavit?.message}
        />
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleReview}
                className="flex-1 rounded-md bg-orange-500 px-6 py-2.5 text-base font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600"
              >
                Review →
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <ReviewStep
            values={watch()}
            onBack={() => setStep(2)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
