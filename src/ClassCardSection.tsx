import { useState } from "react";
import ClassCard from "./ClassCard.js";
import { useQuery } from "@tanstack/react-query";
import { getFullUserProductProgressMap } from "./features/user/utils.ts";
import { ProductData, UserProducts } from "./types/types.ts";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QueryKeys } from "./lib/QueryKeys.ts";
import { strings } from "./utils/strings.ts";
import { getProductStatus, ProductStatus } from "./utils/classProgress.ts";

type FilterId = ProductStatus | "all";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "complete", label: "Complete" },
];

const ClassCardSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();
  const [filter, setFilter] = useState<FilterId>("all");

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKeys.GET_USER_PRODUCTS_MAP, loggedInUserInfo?.id || 0],
    queryFn: getFullUserProductProgressMap,
  });

  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-5">
      <SectionHeader />
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <LoadedContent data={data} filter={filter} setFilter={setFilter} />
      )}
    </div>
  );
};

const SectionHeader = () => (
  <div className="mb-4 flex items-center gap-2">
    <h4 className="text-xl font-semibold text-slate-900 lg:text-2xl">
      {strings["assigned.classes"]}
    </h4>
    <Popover>
      <PopoverTrigger
        aria-label="How this section works"
        className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <Info className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-80 text-sm">
        <p className="mb-2 font-semibold text-slate-800">How this works</p>
        <ul className="list-disc space-y-1 pl-4 text-slate-700">
          <li>Work through a product's classes in order, top to bottom.</li>
          <li>Click to take the assessment at the bottom of each class's PDF page.</li>
        </ul>
      </PopoverContent>
    </Popover>
  </div>
);

type LoadedContentProps = {
  data: UserProducts;
  filter: FilterId;
  setFilter: (f: FilterId) => void;
};

const LoadedContent: React.FC<LoadedContentProps> = ({
  data,
  filter,
  setFilter,
}) => {
  const productsList: ProductData[] = Object.values(data);
  const assignedProductsMap = productsList.reduce((acc, product) => {
    if (product.assigned) acc[product.productId] = product;
    return acc;
  }, {} as UserProducts);
  const assignedProductsList: ProductData[] = productsList.filter(
    (item) => item.assigned,
  );

  if (assignedProductsList.length === 0) return <EmptyState />;

  const filteredProducts =
    filter === "all"
      ? assignedProductsList
      : assignedProductsList.filter(
          (p) => getProductStatus(p, assignedProductsMap) === filter,
        );

  return (
    <>
      <FilterPills
        filter={filter}
        onChange={setFilter}
        products={assignedProductsList}
        assignedProductsMap={assignedProductsMap}
      />
      {filteredProducts.length === 0 ? (
        <NoFilterMatch onReset={() => setFilter("all")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <ClassCard
              key={product.productId}
              product={product}
              assignedProductsMap={assignedProductsMap}
            />
          ))}
        </div>
      )}
    </>
  );
};

type FilterPillsProps = {
  filter: FilterId;
  onChange: (f: FilterId) => void;
  products: ProductData[];
  assignedProductsMap: UserProducts;
};

const FilterPills: React.FC<FilterPillsProps> = ({
  filter,
  onChange,
  products,
  assignedProductsMap,
}) => {
  const counts: Record<FilterId, number> = {
    all: products.length,
    "not-started": products.filter(
      (p) => getProductStatus(p, assignedProductsMap) === "not-started",
    ).length,
    "in-progress": products.filter(
      (p) => getProductStatus(p, assignedProductsMap) === "in-progress",
    ).length,
    complete: products.filter(
      (p) => getProductStatus(p, assignedProductsMap) === "complete",
    ).length,
  };

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const isActive = filter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors lg:text-sm ${
              isActive
                ? "bg-slate-900 text-slate-050"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f.label}
            <span className="ml-1 opacity-60">{counts[f.id]}</span>
          </button>
        );
      })}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 shadow-sm">
    <div className="animate-pulse bg-slate-100 px-3 py-2">
      <div className="h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200" />
    </div>
    <div className="flex flex-col gap-1 p-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-7 animate-pulse rounded-sm bg-slate-100" />
      ))}
    </div>
  </div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {[1, 2, 3, 4].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-050 p-8 text-center">
    <p className="text-sm text-slate-700 lg:text-base">
      You don't have any classes assigned yet — contact your administrator to
      get started.
    </p>
  </div>
);

const NoFilterMatch: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-050 p-6 text-center">
    <p className="text-sm text-slate-700">No classes match this filter.</p>
    <button
      onClick={onReset}
      className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700"
    >
      Show all
    </button>
  </div>
);

export default ClassCardSection;
