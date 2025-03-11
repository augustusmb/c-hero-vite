import {
  NewlyAddedProducts,
  NewlyRemovedProducts,
  UserType,
  RawUserFormData,
  UserProducts,
} from "../types/types";

export function compareProducts(
  userProductData: UserProducts,
  formData: RawUserFormData,
) {
  const newlyAddedProducts: NewlyAddedProducts = {};
  const newlyRemovedProducts: NewlyRemovedProducts = {};

  for (const key in formData.assignedProductChange) {
    if (
      userProductData[key].assigned === false &&
      formData.assignedProductChange[key] === true
    ) {
      newlyAddedProducts[key] = true;
    }
    if (
      userProductData[key].assigned === true &&
      formData.assignedProductChange[key] === false
    ) {
      newlyRemovedProducts[key] = true;
    }
  }

  return { newlyAddedProducts, newlyRemovedProducts };
}

export function createUserInfo(
  formData: RawUserFormData,
  userToEdit: UserType,
  newlyAddedProducts: NewlyAddedProducts,
  newlyRemovedProducts: NewlyRemovedProducts,
) {
  return {
    name: formData.name || userToEdit.name,
    first_name: formData.first_name || userToEdit.first_name,
    last_name: formData.last_name || userToEdit.last_name,
    email: formData.email || userToEdit.email,
    title: formData.title || userToEdit.title,
    company: formData.company || userToEdit.company,
    vessel: formData.vessel || userToEdit.vessel,
    port: formData.port || userToEdit.port,
    id: userToEdit.id,
    newlyAddedProducts,
    newlyRemovedProducts,
  };
}
