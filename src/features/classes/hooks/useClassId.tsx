import { useMemo } from "react";
import { productsMap } from "../../../messages.ts";

export const useClassId = (classId: string) => {
  const classInfo = useMemo(() => productsMap[classId.slice(0, 2)], [classId]);
  const classType = useMemo(() => classId.slice(3, 4), [classId]);

  return { classInfo, classType };
};
