import { z } from "zod";

export const inputStyles =
  "rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
export const errorStyles = "text-red-500 text-sm mt-1";

export enum PositionType {
  CAPTAIN = "captain",
  SHORESIDE = "shoreside",
  CREW = "crew",
}

export const positionOptions = [
  { value: PositionType.CREW, label: "Crew" },
  { value: PositionType.CAPTAIN, label: "Captain" },
  { value: PositionType.SHORESIDE, label: "Shoreside" },
];

export const rescuePoleOptions = [
  { value: "rk", label: "RK", image: "/assets/RK-S.jpeg" },
  { value: "vr", label: "VR14", image: "/assets/VR14.jpeg" },
  { value: "rs", label: "RS14", image: "/assets/RS14.jpeg" },
  { value: "hr", label: "HR14", image: "/assets/HR14-S.jpeg" },
];

export const rescueDavitMountingOptions = [
  {
    value: "b",
    label: "Tugboat Bitt Mount",
    image: "/assets/Tugboat-Bitt-Mount.jpeg",
  },
  {
    value: "f",
    label: "Side of Boat Flat Mount",
    image: "/assets/Side-Boat-Flat-Mount.jpeg",
  },
];

export const rescueDavitOptions = [
  {
    value: "3",
    label: "Series 3 Fixed Davit",
    image: "/assets/Series-3-Fixed-Davit.jpeg",
  },
  {
    value: "5",
    label: "Series 5 Hinged Davit",
    image: "/assets/Series-5-Hinged-Davit.jpeg",
  },
  {
    value: "7",
    label: "Series 7 Swivel Davit",
    image: "/assets/Series-7-Swivel-Davit.jpeg",
  },
  {
    value: "9",
    label: "Series 9 Man Rated",
    image: "/assets/Series-9-Man-Rated.jpeg",
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
  rescuePole: z
    .enum(["rk", "vr", "rs", "hr"], {
      required_error: "Please select a rescue pole type",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Please select a rescue pole type",
    }),
  rescueDavitMount: z
    .enum(["b", "f"], {
      required_error: "Please select a mounting option",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Please select a mounting option",
    }),

  rescueDavit: z
    .enum(["3", "5", "7", "9"], {
      required_error: "Please select a davit type",
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Please select a davit type",
    }),
  consentSMS: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive SMS messages",
  }),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export type TCreateableSelectOption = {
  value: string | number;
  label: string;
  __isNew__?: boolean;
};

export type TCreateableSelectOptions = readonly TCreateableSelectOption[];
