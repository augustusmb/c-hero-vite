//@ts-nocheck

import PropTypes from "prop-types";

const UserProductsStatic = ({ userProductData }) => {

  return (
    <div className="flex flex-col items-start">
      {Object.values(userProductData).map((product) => {
        return (
          <div key={product.productId}>
            <label className="text-md lg:text-lg text-slate-700 italic">
              <input
                type="checkbox"
                name={product.productId}
                checked={product.assigned}
                disabled
              />
              {` ${product.productName}`}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default UserProductsStatic;
