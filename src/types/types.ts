export interface AdminEditUserStaticProps {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProductData
}

export type UserType = {
  id: number
  name: string
  email: string
  phone: string
  level: string
  title: string
  company: string
  vessel: string
  port:  string
  terms_accepted: boolean
};

export interface ClassProgress {
  product_id: string
  user_id: number
  completed: boolean
  data_completed: string | null
}

export interface ProductProgress {
  [key: string]: ClassProgress
}

export interface UserProductData {
  [key: string]: {
    assigned: boolean;
    classProgress: ProductProgress;
    productId: string
    productName: string
  };
}

export type UpdatedUserInfoProducts = {
  name: string
  email: string
  title: string
  company: string
  vessel: string
  port: string
  id: number
  newlyAddedProducts: NewlyAddedProducts
  newlyRemovedProducts: NewlyRemovedProducts
}

export interface NewlyAddedProducts {
  [key: string]: boolean
}

export interface NewlyRemovedProducts {
  [key: string]: boolean
}

export type UpdatedUserInfo = {
  name: string
  email: string
  title: string
  company: string
  vessel: string
  port: string
  id: number
}