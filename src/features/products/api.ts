import apiClient from "../../api/apiClient.ts";
import { Product } from "./types.ts";

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>("api/public/products");
  return data;
};
