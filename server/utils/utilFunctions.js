import db from "../../db/db.js";

export const createUserClassesMap = (userClasses) => {
  const userClassesMap = {};
  userClasses.forEach((class_id) => {
    userClassesMap[class_id.product_id] = class_id;
  });

  return userClassesMap;
};

async function getUserAssessmentsCompletedNumber(usersClasses) {
  const totalAssessments = usersClasses.length;
  const assessmentsCompleted = usersClasses.reduce((acc, userClass) => {
    let numToAdd = userClass.completed ? 1 : 0;
    return acc + numToAdd;
  }, 0);

  return { totalAssessments, assessmentsCompleted };
}

const buildEmptyProductsMap = (products) => {
  const map = {};
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

export const createUserFullProgressMap = (userClassesMap, products) => {
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

export const appendUserFullProductProgressMap = async (dashUser, products) => {
  const { id } = dashUser;

  const userClasses = await db.query(
    "select * from users_products where user_id = $1",
    [id],
  );
  const { totalAssessments, assessmentsCompleted } =
    await getUserAssessmentsCompletedNumber(userClasses);
  const userClassesMap = createUserClassesMap(userClasses);
  const userFullProgressMap = createUserFullProgressMap(
    userClassesMap,
    products,
  );

  const finalUserData = {
    ...dashUser,
    userFullProgressMap,
    totalAssessments,
    assessmentsCompleted,
  };
  return finalUserData;
};

const isDavitCategory = (category) =>
  typeof category === "string" &&
  (category.includes("Davit") || category === "Man Rated");

export const hasDavitProduct = (userProductsMap) =>
  Object.values(userProductsMap).some(
    (entry) => entry?.assigned && isDavitCategory(entry?.category),
  );
