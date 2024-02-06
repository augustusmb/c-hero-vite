import { Link } from "react-router-dom";
import { ClassProgress } from "./types/types";

interface ClassCardItemsProps {
  item: ClassProgress
}
type product = {
  productId: string
  productName: string
  assigned: boolean
  classProgress: ClassProgress
}
interface ClassTypesMap {
  [key: string]: string;
}
const classTypesMapping: ClassTypesMap = {
  a: "Setup",
  b: "Operation",
  c: "MOB Drills",
  d: "Inspection & Storage",
};

const ClassCard = ({ product }: { product: product }) => {

  console.log('product: ', product);

  return (
    <div className="overflow-hidden rounded-lg bg-slate-200 shadow-lg shadow-slate-300">
      <h4 className="w-100 mb-2 bg-slate-500 py-1 text-xs font-semibold text-slate-050 underline lg:text-lg">
        {product?.productName}
      </h4>
      <div className="mb-1 flex flex-col items-start px-2">
        {Object.values(product.classProgress).map((item) => (
          <ClassCardItem key={item.product_id} item={item} />
        ))}
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
          ? "mb-1 w-full rounded-sm bg-orange-200 text-sm text-slate-800 line-through lg:text-lg"
          : "text-slate-950 mb-1 w-full rounded-sm bg-slate-100 text-sm drop-shadow-2xl hover:bg-slate-500 hover:text-slate-050 lg:text-lg	"
      }`}
    >
                <p>{classTypesMapping[item.product_id.slice(3, 4)]}</p>
    </Link>
  );
};

export default ClassCard;
