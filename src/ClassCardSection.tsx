import ClassCard from "./ClassCard.js";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/user.ts";
import CheckIcon from "./assets/icons/icon-check.svg?react";
import { ProductData } from "./types/types.ts";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import BeatLoader from "react-spinners/BeatLoader";
import { QueryKeys } from "./utils/QueryKeys.ts";
import { strings } from "./utils/strings.ts";

const ClassCardSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKeys.GET_USER_PRODUCTS_MAP, loggedInUserInfo?.id || 0],
    queryFn: getFullUserProductProgressMap,
  });

  if (isLoading) return <BeatLoader color="#123abc" loading={true} size={15} />;
  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  const getClassCardSection = () => {
    const productsList: ProductData[] = Object.values(data);

    const assignedProductsList: ProductData[] = productsList.filter(
      (item: ProductData) => item.assigned,
    );

    const classCards = assignedProductsList.map((product: ProductData) => (
      <ClassCard key={product.productId} product={product} />
    ));

    return classCards;
  };

  return (
    <div className="flex flex-col pb-10">
      <h4 className="self-start text-xl font-semibold text-slate-900 underline lg:text-3xl">
        {strings["assigned.classes"]}
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
      <div className="grid grid-cols-2 gap-3">{getClassCardSection()}</div>
    </div>
  );
};

export default ClassCardSection;
