import { UserProducts } from "./types/types";

const UserProductsStatic = ({
  userProductData,
}: {
  userProductData: UserProducts;
}) => {
  const assigned = Object.values(userProductData).filter((p) => p.assigned);
  const unassigned = Object.values(userProductData).filter((p) => !p.assigned);

  return (
    <div className="flex flex-col gap-3">
      {assigned.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {assigned.map((product) => (
            <span
              key={product.productId}
              className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
            >
              {product.productName}
            </span>
          ))}
        </div>
      )}
      {unassigned.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unassigned.map((product) => (
            <span
              key={product.productId}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
            >
              {product.productName}
            </span>
          ))}
        </div>
      )}
      {assigned.length === 0 && (
        <p className="text-sm text-slate-500">No products assigned.</p>
      )}
    </div>
  );
};

export default UserProductsStatic;
