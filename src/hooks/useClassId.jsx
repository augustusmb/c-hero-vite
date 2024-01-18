import { useMemo } from "react";
import { productsMap } from "../messages.js";

export const useClassId = (classId) => {
  const testInfo = useMemo(() => productsMap[classId.slice(0, 2)], [classId]);
  const testType = useMemo(() => classId.slice(3, 4), [classId]);

  return { testInfo, testType };
};
