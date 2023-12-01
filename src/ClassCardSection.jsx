import { useContext, useState } from "react";
import { UserAuthContext } from "./MainPanelLayout.jsx";
import ClassCard from "./ClassCard.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { productsMap } from "./messages.js";

const ClassCardSection = () => {
  const { userInfo } = useContext(UserAuthContext);
  const [userProductsMap, setUserProductsMap] = useState({});

  const fetchUserAssignedProducts = async () => {
    const response = await axios.get(`api/routes/classes`, {
      params: { userId: userInfo.id },
    });

    const userClassesMap = {};
    const userProductsMap = { ...productsMap };

    response.data.forEach((product) => {
      userClassesMap[product.product_id] = product;
    });

    for (let key in userClassesMap) {
      let productCode = key.slice(0, 2);
      let classType = key.slice(3, 4);
      let { assigned, classProgress } = userProductsMap[productCode];
      if (classType === "a") {
        // eslint-disable-next-line no-unused-vars
        userProductsMap[productCode].assigned = true;
        classProgress[`${productCode}_a`] = userClassesMap[`${productCode}_a`];
        classProgress[`${productCode}_b`] = userClassesMap[`${productCode}_b`];
        classProgress[`${productCode}_c`] = userClassesMap[`${productCode}_c`];
        classProgress[`${productCode}_d`] = userClassesMap[`${productCode}_d`];
      }
    }
    setUserProductsMap(userProductsMap);

    console.log("User Products Map: ", userProductsMap);

    return response;
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["products", userInfo.id],
    queryFn: fetchUserAssignedProducts,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <h4>Assigned Classes Below:</h4>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {Object.values(userProductsMap)
          .filter((item) => item.assigned)
          .map((product) => (
            <ClassCard key={product.productId} product={product} />
          ))}
      </div>
    </div>
  );
};

export default ClassCardSection;
