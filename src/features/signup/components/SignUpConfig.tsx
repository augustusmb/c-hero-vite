import { z } from "zod";
import rkImage from "../../../assets/RK-S.jpeg";
import vrImage from "../../../assets/VR14.jpeg";
import rsImage from "../../../assets/RS14.jpeg";
import hrImage from "../../../assets/HR14-S.jpeg";
import tugboatBittMountImage from "../../../assets/Tugboat-Bitt-Mount.jpeg";
import sideBoatFlatMountImage from "../../../assets/Side-Boat-Flat-Mount.jpeg";
import series3FixedDavitImage from "../../../assets/Series-3-Fixed-Davit.jpeg";
import series5HingedDavitImage from "../../../assets/Series-5-Hinged-Davit.jpeg";
import series7SwivelDavitImage from "../../../assets/Series-7-Swivel-Davit.jpeg";
import series9ManRatedImage from "../../../assets/Series-9-Man-Rated.jpeg";

export const inputStyles =
  "rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
export const errorStyles = "text-red-500 text-sm mt-1";

export enum PositionType {
  CAPTAIN = "captain",
  SHORESIDE = "shoreside",
  CREW = "crew",
}

export type RescuePoleType = "rk" | "vr" | "rs" | "hr";
export type RescueDavitMountType = "b" | "f";
export type RescueDavitType = "3" | "5" | "7" | "9";

export const positionOptions = [
  { value: PositionType.CREW, label: "Crew" },
  { value: PositionType.CAPTAIN, label: "Captain" },
  { value: PositionType.SHORESIDE, label: "Shoreside" },
];

export const rescuePoleOptions: Array<{
  value: RescuePoleType;
  label: string;
  image: string;
}> = [
  { value: "rk", label: "RK", image: rkImage },
  { value: "vr", label: "VR14", image: vrImage },
  { value: "rs", label: "RS14", image: rsImage },
  { value: "hr", label: "HR14", image: hrImage },
];

export const rescueDavitMountingOptions: Array<{
  value: RescueDavitMountType;
  label: string;
  image: string;
}> = [
  {
    value: "b",
    label: "Tugboat Bitt Mount",
    image: tugboatBittMountImage,
  },
  {
    value: "f",
    label: "Side of Boat Flat Mount",
    image: sideBoatFlatMountImage,
  },
];

export const rescueDavitOptions: Array<{
  value: RescueDavitType;
  label: string;
  image: string;
}> = [
  {
    value: "3",
    label: "Series 3 Fixed Davit",
    image: series3FixedDavitImage,
  },
  {
    value: "5",
    label: "Series 5 Hinged Davit",
    image: series5HingedDavitImage,
  },
  {
    value: "7",
    label: "Series 7 Swivel Davit",
    image: series7SwivelDavitImage,
  },
  {
    value: "9",
    label: "Series 9 Man Rated",
    image: series9ManRatedImage,
  },
];

export const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email(),
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
    .nullable()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a company",
        });
      }
    }),
  port: z
    .object({
      value: z.union([z.string(), z.number()]),
      label: z.string(),
      __isNew__: z.boolean().optional(),
    })
    .nullable()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a port",
        });
      }
    }),
  vessel: z
    .object({
      value: z.union([z.string(), z.number()]),
      label: z.string(),
      __isNew__: z.boolean().optional(),
    })
    .nullable()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a vessel",
        });
      }
    }),
  position: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .nullable()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a position",
        });
      }
    }),
  rescuePole: z.enum(["rk", "vr", "rs", "hr"]).nullable(),
  rescueDavitMount: z.enum(["b", "f"]).nullable(),
  rescueDavit: z.enum(["3", "5", "7", "9"]).nullable(),
  consentSMS: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive SMS messages",
  }),
}).superRefine((data, ctx) => {
  const hasPole = !!data.rescuePole;
  const hasDavitSeries = !!data.rescueDavit;
  const hasDavitMount = !!data.rescueDavitMount;

  if (!hasPole && !hasDavitSeries && !hasDavitMount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["rescuePole"],
      message: "Please select a rescue pole, a davit, or both.",
    });
    return;
  }

  if (hasDavitSeries && !hasDavitMount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["rescueDavitMount"],
      message: "Please select a mounting option for your davit.",
    });
  }
  if (hasDavitMount && !hasDavitSeries) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["rescueDavit"],
      message: "Please select a davit series.",
    });
  }
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export type TCreateableSelectOption = {
  value: string | number;
  label: string;
  __isNew__?: boolean;
};

export type TCreateableSelectOptions = readonly TCreateableSelectOption[];
