export type UserType = {
  [key: string]: any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_admin?: boolean;
  company: string;
  vessel: string;
  vessel_id: number;
  port_id: number;
  company_id: number;
  port: string;
  terms_accepted: boolean;
};

