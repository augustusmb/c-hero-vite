export type AdminQuestion = {
  id: number;
  title: string;
  true_or_false: boolean;
  correct_answer: string;
  incorrect_answer1: string | null;
  incorrect_answer2: string | null;
  incorrect_answer3: string | null;
  class_ids: string[];
};

export type AdminQuestionPayload = {
  title: string;
  true_or_false: boolean;
  correct_answer: string;
  incorrect_answer1: string;
  incorrect_answer2: string;
  incorrect_answer3: string;
  class_ids: string[];
};
