import { Link } from "react-router-dom";
import { ClassProgress, ProductData, UserProducts } from "./types/types";
import { hasDavitProduct } from "./utils/user";

type ClassCardItemsProps = {
  item: ClassProgress;
};
type ClassCardProps = {
  product: ProductData;
  assignedProductsMap: UserProducts;
};
// type product = {
//   productId: string;
//   productName: string;
//   assigned: boolean;
//   classProgress: ProductProgress;
// };
type ClassTypesMap = {
  [key: string]: string;
};
const classTypesMapping: ClassTypesMap = {
  a: "Setup",
  b: "Operation",
  c: "MOB Drills",
  d: "Inspection & Storage",
  p: "Prusik Strap",
};

const ClassCard: React.FC<ClassCardProps> = ({
  product,
  assignedProductsMap,
}) => {
  const isDavitAssigned = hasDavitProduct(assignedProductsMap);
  const shouldShowPrusik = product.productId === "vr" && !isDavitAssigned;

  const orderSuffixes = shouldShowPrusik
    ? ["a", "b", "p", "d", "c"] // Your current order with Prusik
    : ["a", "b", "d", "c"]; // Order without Prusik
  return (
    <div className="overflow-hidden rounded-lg  bg-slate-050 shadow-lg shadow-slate-300">
      <h4 className="w-100 mb-2 bg-slate-100 py-1 text-xs font-semibold text-slate-800 underline lg:text-lg">
        {product?.productName}
      </h4>
      <div className="items-star mb-1 flex flex-col px-2">
        {orderSuffixes.map((suffix) => {
          const classKey = `${product.productId}_${suffix}`;
          return (
            product.classProgress[classKey] && (
              <ClassCardItem
                key={classKey}
                item={product.classProgress[classKey]}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

const ClassCardItem: React.FC<ClassCardItemsProps> = ({ item }) => {
  return (
    <Link
      to={`/class/${item.product_id}`}
      className={`${
        item.completed
          ? "mb-1 w-full rounded-sm  bg-orange-200 text-sm text-slate-800 line-through lg:text-lg"
          : "mb-1 w-full rounded-sm bg-slate-200  text-sm text-slate-950 drop-shadow-2xl hover:bg-slate-500 hover:text-slate-050 lg:text-lg	"
      }`}
    >
      <p>{classTypesMapping[item.product_id.slice(3, 4)]}</p>
    </Link>
  );
};

export default ClassCard;
