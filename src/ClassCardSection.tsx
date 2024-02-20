import ClassCard from "./ClassCard.js";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/user.ts";
import CheckIcon from "./assets/icons/icon-check.svg?react";
import { ProductProgress } from "./types/types.ts";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";

type Product = {
  productId: string;
  productName: string;
  classProgress: ProductProgress;
  assigned: boolean;
};

const ClassCardSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();

  const { isLoading, isError, data, error } = useQuery<
    { [key: string]: Product },
    Error
  >({
    queryKey: ["products", loggedInUserInfo?.id],
    queryFn: getFullUserProductProgressMap,
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  console.log("data: ", data);

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
        {Object.values(data ?? {})
          .filter((item: Product) => item.assigned)
          .map((product: Product) => (
            <ClassCard key={product.productId} product={product} />
          ))}
      </div>
    </div>
  );
};

export default ClassCardSection;
