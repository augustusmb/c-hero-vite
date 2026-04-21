export type ClassProgress = {
  product_id: string;
  user_id: number;
  completed: boolean;
  data_completed: string | null;
};

export type ProductProgress = {
  [key: string]: ClassProgress;
};

export type ProductData = {
  productId: string;
  productName: string;
  category: string;
  assigned: boolean;
  classProgress: ProductProgress;
};

export type UserProducts = {
  [key: string]: {
    assigned: boolean;
    classProgress: ProductProgress;
    productId: string;
    productName: string;
    category: string;
  };
};
