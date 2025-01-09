export type AdminEditUserStaticProps = {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProducts;
};

export type UserType = {
  [key: string]: any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  level: string;
  title: string;
  company: string;
  vessel: string;
  port: string;
  terms_accepted: boolean;
};

export type CompletedTestData = {
  classId: string;
  first_name: string;
  phone: string;
  userId: number;
  questionsMissed: any;
};

export type UserProducts = {
  [key: string]: {
    assigned: boolean;
    classProgress: ProductProgress;
    productId: string;
    productName: string;
  };
};

export type ProductData = {
  productId: string;
  productName: string;
  assigned: boolean;
  classProgress: ProductProgress;
};

export type ProductProgress = {
  [key: string]: ClassProgress;
};

export type ClassProgress = {
  product_id: string;
  user_id: number;
  completed: boolean;
  data_completed: string | null;
};

export type RawUserFormData = {
  name: string;
  email: string;
  title: string;
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
  email: string;
  title: string;
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
