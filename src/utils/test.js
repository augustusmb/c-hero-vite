export function randomizeArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function prepareAnswerOptions(question) {
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

export function prepareBlankAnswers(questions) {
  let blankAnswers = {};
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