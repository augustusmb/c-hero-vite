import { useContext } from "react";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import ClassCard from "./ClassCard.jsx";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./utils/user.js";

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
      <div className="my-2 flex flex-col">
        <p className="text-left text-lg">{`- Work through a product's classes in order, top to bottom`}</p>
        <p className="text-left text-lg">{`- Study your chosen class's pdf material, click to take the test at the bottom of the page`}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(data)
          .filter((item) => item.assigned)
          .map((product) => (
            <ClassCard key={product.productId} product={product} />
          ))}
      </div>
    </div>
  );
};

export default ClassCardSection;
