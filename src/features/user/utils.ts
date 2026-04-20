import { productsMap } from "../../messages.ts";
import { fetchUserClasses } from "../../api/user.ts";
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

const createUserFullProgressMap = (userClassesMap: ProductProgress) => {
  const userProductsMap = JSON.parse(JSON.stringify(productsMap));
  for (let key in userClassesMap) {
    let productCode = key.slice(0, 2);
    let classType = key.slice(3, 4);
    let { classProgress } = userProductsMap[productCode];
    if (classType === "a") {
      userProductsMap[productCode].assigned = true;
      classProgress[`${productCode}_a`] = userClassesMap[`${productCode}_a`];
      classProgress[`${productCode}_b`] = userClassesMap[`${productCode}_b`];
      classProgress[`${productCode}_c`] = userClassesMap[`${productCode}_c`];
      classProgress[`${productCode}_d`] = userClassesMap[`${productCode}_d`];
      productCode === "vr" &&
        (classProgress[`${productCode}_p`] =
          userClassesMap[`${productCode}_p`]);
    }
  }
  return userProductsMap;
};

export const getFullUserProductProgressMap = async (
  userId: number,
): Promise<UserProducts> => {
  const userClasses = await fetchUserClasses(userId);
  const userClassesMap = createUserClassesMap(userClasses);
  return createUserFullProgressMap(userClassesMap);
};

export const hasDavitProduct = (userProductsMap: UserProducts) => {
  const davitCodes = ["3b", "3f", "5b", "5f", "7b", "7f", "9f"];
  return Object.keys(userProductsMap).some(
    (code) => davitCodes.includes(code) && userProductsMap[code].assigned,
  );
};
