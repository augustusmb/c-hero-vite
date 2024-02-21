export interface AdminEditUserStaticProps {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProducts;
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

export interface UserProducts {
  [key: string]: {
    assigned: boolean;
    classProgress: ProductProgress;
    productId: string;
    productName: string;
  };
}

export interface ProductData {
  productId: string;
  productName: string;
  assigned: boolean;
  classProgress: ProductProgress;
}

export interface ProductProgress {
  [key: string]: ClassProgress;
}

export interface ClassProgress {
  product_id: string;
  user_id: number;
  completed: boolean;
  data_completed: string | null;
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

export type TestQuestion = {
  id: number;
  title: string;
  correct_answer: string;
  incorrect_answer1: string;
  incorrect_answer2: string;
  incorrect_answer3: string;
  true_or_false: string;
  answerOptions: string[];
};
