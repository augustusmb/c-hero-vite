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
      <h4 className="mb-3 self-start text-xl font-semibold text-slate-800 underline lg:text-xl">
        Assigned Classes Below:
      </h4>
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
