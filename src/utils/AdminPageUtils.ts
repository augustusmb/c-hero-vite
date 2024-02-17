import { NewlyAddedProducts, NewlyRemovedProducts } from "../types/types";

export function compareProducts(userProductData: any, data: any) {
  const newlyAddedProducts: NewlyAddedProducts = {};
  const newlyRemovedProducts: NewlyRemovedProducts = {};

  for (const key in userProductData) {
    if (userProductData[key].assigned === false && data[key] === true) {
      newlyAddedProducts[key] = true;
    }
    if (userProductData[key].assigned === true && data[key] === false) {
      newlyRemovedProducts[key] = true;
    }
  }

  return { newlyAddedProducts, newlyRemovedProducts };
}

export function createUserInfo(
  data: any,
  user: any,
  newlyAddedProducts: NewlyAddedProducts,
  newlyRemovedProducts: NewlyRemovedProducts,
) {
  return {
    name: data.name || user.name,
    email: data.email || user.email,
    title: data.title || user.title,
    company: data.company || user.company,
    vessel: data.vessel || user.vessel,
    port: data.port || user.port,
    id: user.id,
    newlyAddedProducts,
    newlyRemovedProducts,
  };
}
