import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClassProgress, ProductData, UserProducts } from "./types/types";
import { hasDavitProduct } from "./features/user/utils";
import { getProductStatus, ProductStatus } from "./utils/classProgress";
import CheckIcon from "./assets/icons/icon-check.svg?react";
import { ChevronRight } from "lucide-react";

type ClassCardItemsProps = {
  item: ClassProgress;
  isNext: boolean;
};
type ClassCardProps = {
  product: ProductData;
  assignedProductsMap: UserProducts;
};

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

const STATUS_STYLES: Record<
  ProductStatus,
  { label: string; className: string }
> = {
  "not-started": {
    label: "Not started",
    className: "bg-slate-200 text-slate-700",
  },
  "in-progress": {
    label: "In progress",
    className: "bg-orange-100 text-orange-700",
  },
  complete: {
    label: "Complete",
    className: "bg-green-100 text-green-700",
  },
};

const ClassCard: React.FC<ClassCardProps> = ({
  product,
  assignedProductsMap,
}) => {
  const isDavitAssigned = hasDavitProduct(assignedProductsMap);
  const shouldShowPrusik = product.productId === "vr" && !isDavitAssigned;

  const orderSuffixes = shouldShowPrusik
    ? ["a", "b", "p", "d", "c"]
    : ["a", "b", "d", "c"];

  const orderedClasses = orderSuffixes
    .map((suffix) => product.classProgress[`${product.productId}_${suffix}`])
    .filter(Boolean);

  const completedCount = orderedClasses.filter((c) => c.completed).length;
  const totalCount = orderedClasses.length;
  const nextIncompleteId = orderedClasses.find((c) => !c.completed)?.product_id;
  const percentComplete =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const status = getProductStatus(product, assignedProductsMap);
  const statusStyle = STATUS_STYLES[status];

  const [displayPercent, setDisplayPercent] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayPercent(percentComplete), 50);
    return () => clearTimeout(t);
  }, [percentComplete]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 shadow-sm">
      <div className="bg-slate-100 px-3 py-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-semibold text-slate-800 lg:text-base">
            {product?.productName}
          </h4>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium lg:text-xs ${statusStyle.className}`}
          >
            {statusStyle.label}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700 ease-out"
              style={{ width: `${displayPercent}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-2">
        {orderedClasses.map((cls) => (
          <ClassCardItem
            key={cls.product_id}
            item={cls}
            isNext={cls.product_id === nextIncompleteId}
          />
        ))}
      </div>
    </div>
  );
};

const ClassCardItem: React.FC<ClassCardItemsProps> = ({ item, isNext }) => {
  const label = classTypesMapping[item.product_id.slice(3, 4)];

  if (item.completed) {
    return (
      <Link
        to={`/class/${item.product_id}`}
        className="flex w-full items-center justify-between rounded-sm bg-green-050 px-2 py-1 text-sm text-slate-700 hover:bg-green-100 lg:text-base"
      >
        <span>{label}</span>
        <CheckIcon className="h-4 w-4 fill-green-050 stroke-green-600" />
      </Link>
    );
  }

  if (isNext) {
    return (
      <Link
        to={`/class/${item.product_id}`}
        className="group flex w-full items-center justify-between rounded-sm bg-orange-500 px-3 py-1.5 text-sm font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 lg:text-base"
      >
        <span>{label}</span>
        <span className="flex items-center gap-0.5 text-xs">
          Continue
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/class/${item.product_id}`}
      className="block w-full rounded-sm bg-slate-100 px-2 py-1 text-sm text-slate-700 hover:bg-slate-200 lg:text-base"
    >
      {label}
    </Link>
  );
};

export default ClassCard;
