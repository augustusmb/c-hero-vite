import { TestQuestion } from "../types/types";

export function randomizeArray(array: [], level: string) {
  if (level === "0") {
    return array.sort((a: TestQuestion, b: TestQuestion) => a.id - b.id);
  }

  return array.sort(() => Math.random() - 0.5);
}

export function prepareAnswerOptions(question: TestQuestion) {
  let {
    correct_answer,
    incorrect_answer1,
    incorrect_answer2,
    incorrect_answer3,
  } = question;
  let answers = [
    correct_answer,
    incorrect_answer1,
    incorrect_answer2,
    incorrect_answer3,
  ];
  let answerOptions = answers
    .filter((answer) => answer)
    .sort(() => Math.random() - 0.5);

  answerOptions.forEach((item, idx) => {
    if (item === "All of the above") {
      answerOptions.splice(idx, 1);
      answerOptions.push("All of the above");
    }
  });

  return answerOptions;
}

type BlankAnswers = {
  [key: number]: {
    title: string;
    slotIndex: number;
    currentAnswer: string;
    correctAnswer: string;
  };
};

export function prepareBlankAnswers(questions: TestQuestion[]) {
  let blankAnswers: BlankAnswers = {};
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
