//@ts-nocheck

import { useContext } from "react";
import { UserAuthContext } from "./MainPanelLayout.js";
import ClassCard from "./ClassCard.js";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/user.ts";
import CheckIcon from "./assets/icons/icon-check.svg?react";
import { ProductProgress } from "./types/types.ts";

type Product = {
  productId: string
  productName: string
  classProgress: ProductProgress
  assigned: boolean
}

const ClassCardSection = () => {
  const { userInfo } = useContext(UserAuthContext);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["products", userInfo.id],
    queryFn: getFullUserProductProgressMap,
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div className="flex flex-col pb-10">
      <h4 className="self-start text-xl font-semibold text-slate-900 underline lg:text-xl">
        Assigned Classes Below:
      </h4>
      <div className="text-md my-2 flex flex-col lg:text-lg">
        <div className="flex">
          <CheckIcon className="h-6 w-6 fill-orange-050 stroke-orange-600" />

          <p className="text-left">{`Work through a product's classes in order, top to bottom`}</p>
        </div>
        <div className="flex">
          <CheckIcon className="h-6 w-6 fill-orange-050 stroke-orange-600" />

          <p className="text-left">{`Click to take the test at the bottom of each class's PDF page`}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(data)
          .filter((item: Product) => item.assigned)
          .map((product: Product) => <ClassCard key={product.productId} product={product} />
          )}
      </div>
    </div>
  );
};

export default ClassCardSection;
