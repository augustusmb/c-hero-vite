import { productsMap } from "../messages.ts";
import { fetchUserClasses } from "../api/user.ts";
import { ProductProgress, ClassProgress } from "../types/types.ts";

export const createUserClassesMap = (userClasses: ClassProgress[]) => {
  const userClassesMap: ProductProgress = {};
  userClasses.forEach((class_id) => {
    userClassesMap[class_id.product_id] = class_id;
  });

  return userClassesMap;
};
// returns an object with the product_id as the key and the user's progress as the value
// {
//   "3b_a": {product_id: '3b_a', user_id: 24, completed: false, date_completed: null},
//   "3b_b": {product_id: '3b_b', user_id: 24, completed: false, date_completed: null},
//   ...
// }

export const createUserFullProgressMap = (userClassesMap: ProductProgress) => {
  const userProductsMap = JSON.parse(JSON.stringify(productsMap));
  // {
  //   "3b":   {
  //   productId: "3b",
  //   productName: "3B Series 3 Davit - Bitt Mount",
  //   classProgress: {},
  //   assigned: false
  //   },
  //   ...
  // }
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
    }
  }

  return userProductsMap;
};

type Params = {
  queryKey: [string, number];
};

export const getFullUserProductProgressMap = async (params: Params) => {
  const userId = params.queryKey[1];
  const userClasses = await fetchUserClasses(userId);
  const userClassesMap = createUserClassesMap(userClasses.data);
  const userFullProgressMap = createUserFullProgressMap(userClassesMap);

  return userFullProgressMap;
};
