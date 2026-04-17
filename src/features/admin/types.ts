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
