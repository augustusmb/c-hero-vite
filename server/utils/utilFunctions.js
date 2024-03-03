import db from '../../db/db.js'
import { productsMap } from './dataUtils.js'

export const createUserClassesMap = (userClasses) => {
  const userClassesMap = {};
  userClasses.forEach((class_id) => {
    userClassesMap[class_id.product_id] = class_id;
  });

  return userClassesMap;
};

async function getUserTestsCompletedNumber(usersClasses) {
  const totalTests = usersClasses.length;
  const testsCompleted = usersClasses.reduce((acc, test) => {
    let numToAdd = test.completed ? 1 : 0;
    return acc + numToAdd;
  }, 0);

  return { totalTests, testsCompleted };
}

export const createUserFullProgressMap = (userClassesMap) => {
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

export const appendUserFullProductProgressMap = async (dashUser) => {
  const { id } = dashUser
  
  const userClasses = await db.query('select * from users_products where user_id = $1', [id]);
  const { totalTests, testsCompleted } = await getUserTestsCompletedNumber(userClasses);
  console.log('totalTests: ', totalTests)
  const userClassesMap = createUserClassesMap(userClasses);
  const userFullProgressMap = createUserFullProgressMap(userClassesMap);

  const finalUserData = { ...dashUser, userFullProgressMap, totalTests, testsCompleted };
  return finalUserData;
};