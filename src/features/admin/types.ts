import { TCreateableSelectOption } from "../signup/components/SignUpConfig.tsx";

export type AssignedProductChange = {
  [key: string]: boolean;
};

export type NewlyAddedProducts = {
  [key: string]: boolean;
};

export type NewlyRemovedProducts = {
  [key: string]: boolean;
};

export type RawUserFormData = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  vessel: string;
  port: string;
  assignedProductChange: AssignedProductChange;
};

export type FormattedUserFormData = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: TCreateableSelectOption | null;
  company: TCreateableSelectOption | null;
  vessel: TCreateableSelectOption | null;
  port: TCreateableSelectOption | null;
  newlyAddedProducts: NewlyAddedProducts;
  newlyRemovedProducts: NewlyRemovedProducts;
};
