export type UserType = {
  [key: string]: any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  level: string;
  company: string;
  vessel: string;
  vessel_id: number;
  port_id: number;
  company_id: number;
  port: string;
  terms_accepted: boolean;
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

export type AssignedProductChange = {
  [key: string]: boolean;
};

export type FormattedUserFormData = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  vessel: string;
  port: string;
  id: number;
  newlyAddedProducts: NewlyAddedProducts;
  newlyRemovedProducts: NewlyRemovedProducts;
};

export type NewlyAddedProducts = {
  [key: string]: boolean;
};

export type NewlyRemovedProducts = {
  [key: string]: boolean;
};

