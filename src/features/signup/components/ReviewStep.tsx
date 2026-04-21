import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { strings } from "../../../utils/strings";
import {
  errorStyles,
  rescueDavitMountingOptions,
  rescueDavitOptions,
  rescuePoleOptions,
  TSignUpSchema,
} from "./SignUpConfig";

type ReviewStepProps = {
  values: TSignUpSchema;
  onBack: () => void;
  register: UseFormRegister<TSignUpSchema>;
  errors: FieldErrors<TSignUpSchema>;
  isSubmitting: boolean;
};

const MISSING_TEXT = "Not selected";

const labelOf = <T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  value: T | null | undefined,
) => options.find((o) => o.value === value)?.label;

export function ReviewStep({
  values,
  onBack,
  register,
  errors,
  isSubmitting,
}: ReviewStepProps) {
  const poleLabel = labelOf(rescuePoleOptions, values.rescuePole);
  const davitSeriesLabel = labelOf(rescueDavitOptions, values.rescueDavit);
  const davitMountLabel = labelOf(
    rescueDavitMountingOptions,
    values.rescueDavitMount,
  );

  const hasPole = !!poleLabel;
  const hasDavit = !!davitSeriesLabel && !!davitMountLabel;
  const davitSummary = hasDavit
    ? `${davitSeriesLabel} — ${davitMountLabel}`
    : MISSING_TEXT;

  return (
    <>
      <p className="text-sm text-slate-600">
        Please review your info before submitting. Use{" "}
        <span className="font-medium">Back</span> to make changes.
      </p>

      <ReviewCard title="Your info">
        <ReviewRow label="Name" value={`${values.firstName} ${values.lastName}`} />
        <ReviewRow label="Email" value={values.email} />
        <ReviewRow label="Phone" value={values.phone} />
      </ReviewCard>

      <ReviewCard title="Company & vessel">
        <ReviewRow label="Company" value={values.company?.label} />
        <ReviewRow label="Port" value={values.port?.label} />
        <ReviewRow label="Vessel" value={values.vessel?.label} />
        <ReviewRow label="Position" value={values.position?.label} />
      </ReviewCard>

      <ReviewCard title="Equipment">
        <ReviewRow
          label="Rescue pole"
          value={poleLabel ?? MISSING_TEXT}
          missing={!hasPole}
        />
        <ReviewRow
          label="Davit"
          value={davitSummary}
          missing={!hasDavit}
        />
      </ReviewCard>

      <div className="mt-2 flex items-start gap-3">
        <input
          {...register("consentSMS")}
          type="checkbox"
          id="consentSMS"
          className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="consentSMS"
          className="text-left text-sm leading-relaxed text-slate-600"
        >
          {strings["sms.consent"]}
        </label>
      </div>
      {errors.consentSMS && (
        <p className={errorStyles}>{errors.consentSMS.message}</p>
      )}

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-md bg-orange-500 px-6 py-2.5 text-base font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 disabled:bg-orange-300"
        >
          Create Account
        </button>
      </div>
    </>
  );
}

function ReviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[max-content_1fr]">
        {children}
      </dl>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  missing = false,
}: {
  label: string;
  value: string | null | undefined;
  missing?: boolean;
}) {
  const display = value && value.length > 0 ? value : MISSING_TEXT;
  return (
    <>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd
        className={`text-sm ${
          missing || display === MISSING_TEXT
            ? "font-medium text-amber-700"
            : "text-slate-900"
        }`}
      >
        {display}
      </dd>
    </>
  );
}
