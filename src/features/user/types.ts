import { TCreateableSelectOption } from "../signup/components/SignUpConfig.tsx";

export type UpdatedUserInfo = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company: TCreateableSelectOption;
  vessel: TCreateableSelectOption;
  port: TCreateableSelectOption;
  position: TCreateableSelectOption;
  id: number;
};
