import { useMemo } from "react";
import { productsMap } from "../messages.ts";

export const useClassId = (classId: string) => {
  const testInfo = useMemo(() => productsMap[classId.slice(0, 2)], [classId]);
  const testType = useMemo(() => classId.slice(3, 4), [classId]);

  return { testInfo, testType };
};
