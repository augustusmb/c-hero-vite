import { UserProductData } from "./types/types";

const UserProductsStatic = ({
  userProductData,
}: {
  userProductData: UserProductData;
}) => {
  return (
    <div className="flex flex-col items-start">
      {Object.values(userProductData).map((product) => {
        return (
          <div key={product.productId}>
            <label className="text-md italic text-slate-700 lg:text-lg">
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
