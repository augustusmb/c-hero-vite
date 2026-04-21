import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "../../products/queries.ts";

export const useClassId = (classId: string) => {
  const { data: products, isLoading } = useQuery(productsQuery());

  const classInfo = useMemo(() => {
    const code = classId.slice(0, 2);
    const product = products?.find((p) => p.id === code);
    return product
      ? {
          productId: product.id,
          productName: product.name,
          category: product.category,
        }
      : undefined;
  }, [classId, products]);

  const classType = useMemo(() => classId.slice(3, 4), [classId]);

  return { classInfo, classType, isLoading };
};
