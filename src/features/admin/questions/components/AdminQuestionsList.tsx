import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import BeatLoader from "react-spinners/BeatLoader";
import { adminQuestionsQuery } from "../queries.ts";
import { productsQuery } from "../../../products/queries.ts";
import { CLASS_LABELS } from "../../../classes/classLabel.ts";
import AdminQuestionRow from "./AdminQuestionRow.tsx";

const CLASS_SUFFIX_OPTIONS = ["a", "b", "c", "d", "p"];

const splitClassId = (cid: string): [string, string] => {
  const i = cid.lastIndexOf("_");
  if (i === -1) return [cid, ""];
  return [cid.slice(0, i), cid.slice(i + 1)];
};

const AdminQuestionsList = () => {
  const { data, isLoading, isError, error } = useQuery(adminQuestionsQuery());
  const { data: products = [] } = useQuery(productsQuery());
  const [filterProductId, setFilterProductId] = useState<string>("");
  const [filterSuffix, setFilterSuffix] = useState<string>("");
  const [filterId, setFilterId] = useState<string>("");
  const [addingNew, setAddingNew] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((q) => {
      if (filterId && String(q.id) !== filterId.trim()) return false;
      if (!filterProductId && !filterSuffix) return true;
      return q.class_ids.some((cid) => {
        const [pid, sfx] = splitClassId(cid);
        if (filterProductId && pid !== filterProductId) return false;
        if (filterSuffix && sfx !== filterSuffix) return false;
        return true;
      });
    });
  }, [data, filterProductId, filterSuffix, filterId]);

  const filterDescription = useMemo(() => {
    const parts: string[] = [];
    if (filterId.trim()) parts.push(`#${filterId.trim()}`);
    if (filterProductId || filterSuffix) {
      const productLabel = filterProductId
        ? products.find((p) => p.id === filterProductId)?.name ??
          filterProductId
        : "any product";
      const classLabel = filterSuffix
        ? CLASS_LABELS[filterSuffix] ?? filterSuffix
        : "any class";
      parts.push(`${productLabel} · ${classLabel}`);
    }
    return parts.join(" · ");
  }, [filterProductId, filterSuffix, filterId, products]);

  const hasFilters = Boolean(
    filterProductId || filterSuffix || filterId.trim(),
  );

  const clearFilters = () => {
    setFilterProductId("");
    setFilterSuffix("");
    setFilterId("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <BeatLoader color="#123abc" loading={true} size={15} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600">Error: {(error as Error).message}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 shadow-sm">
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-bold text-slate-800">Questions</h1>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-sm">
                <span className="text-slate-600">ID:</span>
                <input
                  type="number"
                  min="1"
                  placeholder="#"
                  value={filterId}
                  onChange={(e) => setFilterId(e.target.value)}
                  className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <span className="text-slate-600">Product:</span>
                <select
                  value={filterProductId}
                  onChange={(e) => setFilterProductId(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  <option value="">All products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <span className="text-slate-600">Class:</span>
                <select
                  value={filterSuffix}
                  onChange={(e) => setFilterSuffix(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  <option value="">All classes</option>
                  {CLASS_SUFFIX_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {CLASS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                size="sm"
                onClick={() => setAddingNew(true)}
                disabled={addingNew}
              >
                + Add question
              </Button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-xs text-slate-500">
              {data?.length ?? 0} total
              {filterDescription
                ? ` · ${filtered.length} matching ${filterDescription}`
                : ""}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-0.5 rounded text-xs text-slate-500 underline-offset-2 hover:text-orange-600 hover:underline"
              >
                × Clear filters
              </button>
            )}
          </div>
        </div>

        {addingNew && (
          <AdminQuestionRow
            question={null}
            initialEditing
            onFinishCreate={() => setAddingNew(false)}
          />
        )}

        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            {filterDescription
              ? `No questions matching ${filterDescription}.`
              : "No questions yet."}
          </p>
        ) : (
          <div>
            {filtered.map((q) => (
              <AdminQuestionRow key={q.id} question={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestionsList;
