import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "../../../products/queries.ts";
import {
  CLASS_LABELS_SHORT,
  CLASS_PILL_STYLES,
} from "../../../classes/classLabel.ts";
import { Product } from "../../../products/types.ts";

const CLASS_SUFFIXES = ["a", "b", "c", "d"];
const PRUSIK_KEY = "p";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
};

const ProductGridTable = ({
  products,
  selected,
  toggle,
}: {
  products: Product[];
  selected: Set<string>;
  toggle: (classId: string) => void;
}) => (
  <table className="w-full text-xs">
    <thead>
      <tr className="border-b border-slate-200 text-left">
        <th className="py-1.5 pr-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">
          Product
        </th>
        {CLASS_SUFFIXES.map((s) => (
          <th key={s} className="px-1 py-1.5 text-center">
            <span
              className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                CLASS_PILL_STYLES[s] ?? "bg-slate-100 text-slate-700"
              }`}
            >
              {CLASS_LABELS_SHORT[s]}
            </span>
          </th>
        ))}
        <th className="px-1 py-1.5 text-center">
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
              CLASS_PILL_STYLES[PRUSIK_KEY] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {CLASS_LABELS_SHORT[PRUSIK_KEY]}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id} className="border-b border-slate-100">
          <td className="py-1 pr-2 text-slate-700">{product.name}</td>
          {CLASS_SUFFIXES.map((s) => {
            const classId = `${product.id}_${s}`;
            return (
              <td key={s} className="px-1 py-1 text-center">
                <input
                  type="checkbox"
                  aria-label={`${product.id} ${CLASS_LABELS_SHORT[s]}`}
                  checked={selected.has(classId)}
                  onChange={() => toggle(classId)}
                  className="h-3.5 w-3.5 cursor-pointer accent-orange-500"
                />
              </td>
            );
          })}
          <td className="px-1 py-1 text-center">
            {product.id === "vr" ? (
              <input
                type="checkbox"
                aria-label={`vr ${CLASS_LABELS_SHORT[PRUSIK_KEY]}`}
                checked={selected.has("vr_p")}
                onChange={() => toggle("vr_p")}
                className="h-3.5 w-3.5 cursor-pointer accent-orange-500"
              />
            ) : (
              <span className="text-slate-300">—</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ClassIdMultiSelect = ({ value, onChange }: Props) => {
  const { data: products, isLoading } = useQuery(productsQuery());
  const selected = new Set(value);

  const toggle = (classId: string) => {
    const next = new Set(selected);
    if (next.has(classId)) next.delete(classId);
    else next.add(classId);
    onChange(Array.from(next).sort());
  };

  if (isLoading || !products) {
    return (
      <div className="text-sm text-slate-500">Loading class options…</div>
    );
  }

  const half = Math.ceil(products.length / 2);
  const left = products.slice(0, half);
  const right = products.slice(half);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-2">
      <ProductGridTable
        products={left}
        selected={selected}
        toggle={toggle}
      />
      <ProductGridTable
        products={right}
        selected={selected}
        toggle={toggle}
      />
    </div>
  );
};

export default ClassIdMultiSelect;
