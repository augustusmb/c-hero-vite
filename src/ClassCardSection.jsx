import ClassCard from "./ClassCard.jsx";

import { productsArray } from "./messages.js";

const ClassCardSection = () => {
  return (
    <div>
      <h4>Product Classes Below:</h4>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {productsArray.map((item) => (
          <ClassCard key={item.code} product={item} />
        ))}
      </div>
    </div>
  );
};

export default ClassCardSection;
