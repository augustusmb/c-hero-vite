import { z } from "zod";

export const adminQuestionSchema = z
  .object({
    title: z.string().min(1, "Question text is required"),
    true_or_false: z.boolean(),
    correct_answer: z.string().min(1, "Correct answer is required"),
    incorrect_answer1: z.string(),
    incorrect_answer2: z.string(),
    incorrect_answer3: z.string(),
    class_ids: z.array(z.string()).min(1, "Select at least one class"),
  })
  .refine(
    (data) =>
      data.true_or_false ||
      [
        data.incorrect_answer1,
        data.incorrect_answer2,
        data.incorrect_answer3,
      ].some((a) => a.trim().length > 0),
    {
      message: "Multiple-choice questions need at least one incorrect answer",
      path: ["incorrect_answer1"],
    },
  );

export type AdminQuestionFormValues = z.infer<typeof adminQuestionSchema>;
