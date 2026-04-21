import { ProductData, UserProducts } from "./types";
import { hasDavitProduct } from "../user/utils";

export type ProductStatus = "not-started" | "in-progress" | "complete";

const SUFFIX_ORDER = ["a", "b", "c", "d", "p"];

const splitClassId = (classId: string): [string, string] | null => {
  const i = classId.lastIndexOf("_");
  if (i === -1) return null;
  return [classId.slice(0, i), classId.slice(i + 1)];
};

export const getPredecessorClassId = (classId: string): string | null => {
  const parts = splitClassId(classId);
  if (!parts) return null;
  const [productId, suffix] = parts;
  const idx = SUFFIX_ORDER.indexOf(suffix);
  if (idx <= 0) return null;
  return `${productId}_${SUFFIX_ORDER[idx - 1]}`;
};

export const isClassLocked = (
  classId: string,
  userProductsMap: UserProducts | undefined,
): boolean => {
  if (!userProductsMap) return false;
  const predecessorId = getPredecessorClassId(classId);
  if (!predecessorId) return false;
  const parts = splitClassId(predecessorId);
  if (!parts) return false;
  const [productId] = parts;
  const predecessor =
    userProductsMap[productId]?.classProgress?.[predecessorId];
  if (!predecessor) return false;
  return !predecessor.completed;
};

export function getVisibleSuffixes(
  product: ProductData,
  assignedProductsMap?: UserProducts,
): string[] {
  const isDavitAssigned = assignedProductsMap
    ? hasDavitProduct(assignedProductsMap)
    : false;
  const shouldShowPrusik = product.productId === "vr" && !isDavitAssigned;
  return shouldShowPrusik
    ? ["a", "b", "c", "d", "p"]
    : ["a", "b", "c", "d"];
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
