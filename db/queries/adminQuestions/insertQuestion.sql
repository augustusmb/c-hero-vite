INSERT INTO questions (
  title,
  true_or_false,
  correct_answer,
  incorrect_answer1,
  incorrect_answer2,
  incorrect_answer3
)
VALUES (
  ${title},
  ${true_or_false},
  ${correct_answer},
  ${incorrect_answer1},
  ${incorrect_answer2},
  ${incorrect_answer3}
)
RETURNING id
