import { AssessmentQuestion } from "./types";

const ALL_OF_THE_ABOVE = "All of the above";

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function randomizeArray(
  questions: readonly AssessmentQuestion[],
  isAdmin: boolean,
): AssessmentQuestion[] {
  if (isAdmin) {
    return [...questions].sort((a, b) => a.id - b.id);
  }
  return shuffle(questions);
}

export function prepareAnswerOptions(question: AssessmentQuestion): string[] {
  const {
    correct_answer,
    incorrect_answer1,
    incorrect_answer2,
    incorrect_answer3,
  } = question;

  const candidates = [
    correct_answer,
    incorrect_answer1,
    incorrect_answer2,
    incorrect_answer3,
  ].filter(Boolean);

  const hasAllOfTheAbove = candidates.includes(ALL_OF_THE_ABOVE);
  const shufflable = candidates.filter((a) => a !== ALL_OF_THE_ABOVE);
  const shuffled = shuffle(shufflable);

  return hasAllOfTheAbove ? [...shuffled, ALL_OF_THE_ABOVE] : shuffled;
}

type BlankAnswers = {
  [key: number]: {
    title: string;
    slotIndex: number;
    currentAnswer: string;
    correctAnswer: string;
  };
};

export function prepareBlankAnswers(
  questions: AssessmentQuestion[],
): BlankAnswers {
  const blankAnswers: BlankAnswers = {};
  questions.forEach((question, slotIndex) => {
    blankAnswers[question.id] = {
      title: question.title,
      slotIndex: slotIndex + 1,
      currentAnswer: "",
      correctAnswer: question.correct_answer,
    };
  });
  return blankAnswers;
}
