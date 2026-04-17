import { ProductData, UserProducts } from "./types";
import { hasDavitProduct } from "../user/utils";

export type ProductStatus = "not-started" | "in-progress" | "complete";

function getVisibleSuffixes(
  product: ProductData,
  assignedProductsMap?: UserProducts,
): string[] {
  const isDavitAssigned = assignedProductsMap
    ? hasDavitProduct(assignedProductsMap)
    : false;
  const shouldShowPrusik = product.productId === "vr" && !isDavitAssigned;
  return shouldShowPrusik ? ["a", "b", "p", "d", "c"] : ["a", "b", "d", "c"];
}

export function getProductStatus(
  product: ProductData,
  assignedProductsMap?: UserProducts,
): ProductStatus {
  const suffixes = getVisibleSuffixes(product, assignedProductsMap);
  const relevantClasses = suffixes
    .map((s) => product.classProgress[`${product.productId}_${s}`])
    .filter(Boolean);

  if (relevantClasses.length === 0) return "not-started";
  const completedCount = relevantClasses.filter((c) => c.completed).length;
  if (completedCount === 0) return "not-started";
  if (completedCount === relevantClasses.length) return "complete";
  return "in-progress";
}
