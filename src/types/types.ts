export interface AdminEditUserStaticProps {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProductData;
}

export interface UserType {
  [key: string]: any;
  id: number;
  name: string;
  email: string;
  phone: string;
  level: string;
  title: string;
  company: string;
  vessel: string;
  port: string;
  terms_accepted: boolean;
}

export type CompletedTestData = {
  classId: string;
  name: string;
  phone: string;
  userId: number;
  questionsMissed: any;
};

export interface ProductProgress {
  [key: string]: ClassProgress;
}

export interface ClassProgress {
  product_id: string;
  user_id: number;
  completed: boolean;
  data_completed: string | null;
}

export interface UserProductData {
  [key: string]: {
    assigned: boolean;
    classProgress: ProductProgress;
    productId: string;
    productName: string;
  };
}

export type RawUserFormData = {
  name: string;
  email: string;
  title: string;
  company: string;
  vessel: string;
  port: string;
  assignedProductChange: AssignedProductChange;
};

export interface AssignedProductChange {
  [key: string]: boolean;
}

export type FormattedUserFormData = {
  name: string;
  email: string;
  title: string;
  company: string;
  vessel: string;
  port: string;
  id: number;
  newlyAddedProducts: NewlyAddedProducts;
  newlyRemovedProducts: NewlyRemovedProducts;
};

export interface NewlyAddedProducts {
  [key: string]: boolean;
}

export interface NewlyRemovedProducts {
  [key: string]: boolean;
}

export type UpdatedUserInfo = {
  name: string;
  email: string;
  title: string;
  company: string;
  vessel: string;
  port: string;
  id: number;
};
