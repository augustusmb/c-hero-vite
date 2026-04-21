import { fetchUserClasses } from "../../api/user.ts";
import { getProducts } from "../products/api.ts";
import { Product } from "../products/types.ts";
import {
  ProductProgress,
  ClassProgress,
  UserProducts,
} from "../classes/types.ts";

// Returns an object keyed by product_id (e.g., "3b_a") where each value is the
// user's progress row for that class:
//   { "3b_a": { product_id, user_id, completed, date_completed }, ... }
const createUserClassesMap = (userClasses: ClassProgress[]) => {
  const userClassesMap: ProductProgress = {};
  userClasses.forEach((class_id) => {
    userClassesMap[class_id.product_id] = class_id;
  });
  return userClassesMap;
};

const buildEmptyProductsMap = (products: Product[]): UserProducts => {
  const map: UserProducts = {};
  for (const product of products) {
    map[product.id] = {
      productId: product.id,
      productName: product.name,
      category: product.category,
      classProgress: {},
      assigned: false,
    };
  }
  return map;
};

const createUserFullProgressMap = (
  userClassesMap: ProductProgress,
  products: Product[],
): UserProducts => {
  const userProductsMap = buildEmptyProductsMap(products);
  for (let key in userClassesMap) {
    let productCode = key.slice(0, 2);
    let classType = key.slice(3, 4);
    if (!userProductsMap[productCode]) continue;
    let { classProgress } = userProductsMap[productCode];
    if (classType === "a") {
      userProductsMap[productCode].assigned = true;
      classProgress[`${productCode}_a`] = userClassesMap[`${productCode}_a`];
      classProgress[`${productCode}_b`] = userClassesMap[`${productCode}_b`];
      classProgress[`${productCode}_c`] = userClassesMap[`${productCode}_c`];
      classProgress[`${productCode}_d`] = userClassesMap[`${productCode}_d`];
      if (productCode === "vr") {
        classProgress[`${productCode}_p`] = userClassesMap[`${productCode}_p`];
      }
    }
  }
  return userProductsMap;
};

export const getFullUserProductProgressMap = async (
  userId: number,
): Promise<UserProducts> => {
  const [userClasses, products] = await Promise.all([
    fetchUserClasses(userId),
    getProducts(),
  ]);
  const userClassesMap = createUserClassesMap(userClasses);
  return createUserFullProgressMap(userClassesMap, products);
};

const isDavitCategory = (category: string | undefined) =>
  typeof category === "string" &&
  (category.includes("Davit") || category === "Man Rated");

export const hasDavitProduct = (userProductsMap: UserProducts) =>
  Object.values(userProductsMap).some(
    (entry) => entry?.assigned && isDavitCategory(entry?.category),
  );
