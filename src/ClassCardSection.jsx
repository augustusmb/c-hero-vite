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
    <div>
      <h4>Assigned Classes Below:</h4>
      <div className="grid grid-cols-2 lg:grid-cols-4">
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
