import { Product } from "../products/types.ts";

export const CLASS_LABELS: Record<string, string> = {
  a: "Setup",
  b: "Operations",
  c: "Inspection & Storage",
  d: "MOB Drills",
  p: "Prusik Strap",
};

// Short labels for dense UI surfaces (chips, narrow grid headers) where the
// full names create too much horizontal bleed.
export const CLASS_LABELS_SHORT: Record<string, string> = {
  a: "Setup",
  b: "Ops",
  c: "I & S",
  d: "Drills",
  p: "Prusik",
};

// Tailwind classes for each class-type pill. Uses the custom palette in
// src/assets/palette-19.json. Orange is reserved for the app's primary
// interactive accent, so we pick 5 distinct non-orange hues.
export const CLASS_PILL_STYLES: Record<string, string> = {
  a: "bg-indigo-050 text-indigo-700",
  b: "bg-green-050 text-green-700",
  c: "bg-yellow-050 text-yellow-800",
  d: "bg-red-050 text-red-700",
  p: "bg-magenta-050 text-magenta-700",
};

const SUFFIX_ORDER = ["a", "b", "c", "d", "p"];

const splitClassId = (classId: string): [string, string] => {
  const i = classId.lastIndexOf("_");
  if (i === -1) return [classId, ""];
  return [classId.slice(0, i), classId.slice(i + 1)];
};

export function formatClassId(classId: string, products: Product[]): string {
  const [productId, suffix] = splitClassId(classId);
  const product = products.find((p) => p.id === productId);
  const productName = product?.name ?? productId;
  const classLabel = CLASS_LABELS[suffix] ?? suffix;
  return `${productName} - ${classLabel}`;
}

export type GroupedClassIds = Array<{
  productId: string;
  productName: string;
  suffixes: string[];
}>;

export function groupClassIdsByProduct(
  classIds: string[],
  products: Product[],
): GroupedClassIds {
  const map = new Map<string, string[]>();
  for (const cid of classIds) {
    const [productId, suffix] = splitClassId(cid);
    if (!map.has(productId)) map.set(productId, []);
    map.get(productId)!.push(suffix);
  }
  return Array.from(map.entries())
    .map(([productId, suffixes]) => ({
      productId,
      productName: products.find((p) => p.id === productId)?.name ?? productId,
      suffixes: suffixes.sort(
        (a, b) => SUFFIX_ORDER.indexOf(a) - SUFFIX_ORDER.indexOf(b),
      ),
    }))
    .sort((a, b) => a.productName.localeCompare(b.productName));
}
