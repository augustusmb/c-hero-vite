UPDATE questions
SET
  title = ${title},
  true_or_false = ${true_or_false},
  correct_answer = ${correct_answer},
  incorrect_answer1 = ${incorrect_answer1},
  incorrect_answer2 = ${incorrect_answer2},
  incorrect_answer3 = ${incorrect_answer3}
WHERE id = ${id}
