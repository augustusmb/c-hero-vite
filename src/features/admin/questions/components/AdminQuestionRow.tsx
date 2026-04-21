import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { AdminQuestion } from "../types.ts";
import {
  adminQuestionSchema,
  AdminQuestionFormValues,
} from "../schema.ts";
import { adminQuestionsKeys } from "../queries.ts";
import {
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
} from "../api.ts";
import { productsQuery } from "../../../products/queries.ts";
import {
  CLASS_LABELS_SHORT,
  CLASS_PILL_STYLES,
  groupClassIdsByProduct,
} from "../../../classes/classLabel.ts";
import ClassIdMultiSelect from "./ClassIdMultiSelect.tsx";

const ALL_SUFFIXES = ["a", "b", "c", "d", "p"];

type Props = {
  question: AdminQuestion | null;
  initialEditing?: boolean;
  onFinishCreate?: () => void;
};

const defaultValuesFor = (q: AdminQuestion | null): AdminQuestionFormValues => ({
  title: q?.title ?? "",
  true_or_false: q?.true_or_false ?? false,
  correct_answer: q?.correct_answer ?? "",
  incorrect_answer1: q?.incorrect_answer1 ?? "",
  incorrect_answer2: q?.incorrect_answer2 ?? "",
  incorrect_answer3: q?.incorrect_answer3 ?? "",
  class_ids: q?.class_ids ?? [],
});

const AdminQuestionRow = ({
  question,
  initialEditing = false,
  onFinishCreate,
}: Props) => {
  const [editing, setEditing] = useState(initialEditing);
  const queryClient = useQueryClient();
  const { data: products = [] } = useQuery(productsQuery());
  const isNew = question === null;

  const form = useForm<AdminQuestionFormValues>({
    resolver: zodResolver(adminQuestionSchema),
    defaultValues: defaultValuesFor(question),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: adminQuestionsKeys.all });

  const createMutation = useMutation({
    mutationFn: createAdminQuestion,
    onSuccess: () => {
      toast.success("Question added");
      invalidate();
      onFinishCreate?.();
    },
    onError: (err: Error) => toast.error(`Save failed: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: (values: AdminQuestionFormValues) =>
      updateAdminQuestion(question!.id, values),
    onSuccess: () => {
      toast.success("Question updated");
      setEditing(false);
      invalidate();
    },
    onError: (err: Error) => toast.error(`Save failed: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminQuestion(question!.id),
    onSuccess: () => {
      toast.success("Question deleted");
      invalidate();
    },
    onError: (err: Error) => toast.error(`Delete failed: ${err.message}`),
  });

  const onSubmit = (values: AdminQuestionFormValues) => {
    if (question && question.class_ids.length > 1) {
      const proceed = window.confirm(
        `This question is attached to ${question.class_ids.length} classes. Saving will update it everywhere. Continue?`,
      );
      if (!proceed) return;
    }
    if (isNew) createMutation.mutate(values);
    else updateMutation.mutate(values);
  };

  const onDelete = () => {
    if (!question) return;
    const scope =
      question.class_ids.length > 0
        ? `${question.class_ids.length} class${question.class_ids.length > 1 ? "es" : ""}`
        : "no classes";
    const proceed = window.confirm(
      `Delete this question? It is currently attached to ${scope}. This cannot be undone.`,
    );
    if (proceed) deleteMutation.mutate();
  };

  const onCancel = () => {
    if (isNew) {
      onFinishCreate?.();
    } else {
      form.reset(defaultValuesFor(question));
      setEditing(false);
    }
  };

  const isTrueFalse = form.watch("true_or_false");
  const classIds = form.watch("class_ids");

  if (!editing && question) {
    const grouped = groupClassIdsByProduct(question.class_ids, products);
    return (
      <div className="border-b border-slate-200 px-5 py-5 odd:bg-white even:bg-slate-050/50 hover:bg-indigo-050/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="shrink-0 pt-1 font-mono text-xs text-slate-400">
                #{question.id}
              </span>
              {question.true_or_false && (
                <span className="shrink-0 translate-y-0.5 rounded border border-indigo-200 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                  T/F
                </span>
              )}
              <p className="text-base font-medium leading-relaxed text-slate-800 lg:text-lg">
                {question.title}
              </p>
            </div>

            {grouped.length === 0 ? (
              <p className="pl-7 text-xs italic text-orange-600">
                Not attached to any class
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 pl-7 lg:grid-cols-2">
                {grouped.map((group) => {
                  const assignedSet = new Set(group.suffixes);
                  return (
                    <div
                      key={group.productId}
                      className="grid grid-cols-[minmax(0,1fr)_repeat(5,50px)] items-center gap-x-1"
                    >
                      <span className="text-xs font-medium text-slate-500">
                        {group.productName}
                      </span>
                      {ALL_SUFFIXES.map((suffix) => {
                        const applicable =
                          suffix !== "p" || group.productId === "vr";
                        if (!applicable) return <span key={suffix} />;
                        const assigned = assignedSet.has(suffix);
                        return (
                          <span
                            key={suffix}
                            className={`rounded px-1 py-0 text-center text-[11px] ${
                              assigned
                                ? CLASS_PILL_STYLES[suffix] ??
                                  "bg-slate-100 text-slate-700"
                                : "text-slate-300"
                            }`}
                          >
                            {CLASS_LABELS_SHORT[suffix] ?? suffix}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="border-b border-slate-200 bg-orange-050/40 px-4 py-4"
    >
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-600">
            Question text
          </label>
          <textarea
            {...form.register("title")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            rows={2}
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            {...form.register("true_or_false")}
            className="h-4 w-4 cursor-pointer accent-orange-500"
          />
          True / False question
        </label>

        <div>
          <label className="text-xs font-medium text-slate-600">
            Correct answer
          </label>
          {isTrueFalse ? (
            <div className="mt-1 flex gap-3 text-sm">
              {["TRUE", "FALSE"].map((v) => (
                <label key={v} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    value={v}
                    {...form.register("correct_answer")}
                    className="accent-orange-500"
                  />
                  {v}
                </label>
              ))}
            </div>
          ) : (
            <Input {...form.register("correct_answer")} className="mt-1" />
          )}
          {form.formState.errors.correct_answer && (
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.correct_answer.message}
            </p>
          )}
        </div>

        {!isTrueFalse && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600">
              Incorrect answers (at least one required)
            </label>
            {[1, 2, 3].map((n) => (
              <Input
                key={n}
                placeholder={`Incorrect answer ${n}`}
                {...form.register(
                  `incorrect_answer${n}` as
                    | "incorrect_answer1"
                    | "incorrect_answer2"
                    | "incorrect_answer3",
                )}
              />
            ))}
            {form.formState.errors.incorrect_answer1 && (
              <p className="text-xs text-red-600">
                {form.formState.errors.incorrect_answer1.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-slate-600">
            Applies to classes ({classIds.length} selected)
          </label>
          <div className="mt-1 rounded-md border border-slate-200 bg-white p-2">
            <ClassIdMultiSelect
              value={classIds}
              onChange={(next) =>
                form.setValue("class_ids", next, { shouldValidate: true })
              }
            />
          </div>
          {form.formState.errors.class_ids && (
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.class_ids.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {!isNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={deleteMutation.isPending}
              className="mr-auto text-red-600 hover:bg-red-050"
            >
              Delete
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isNew ? "Add" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AdminQuestionRow;
