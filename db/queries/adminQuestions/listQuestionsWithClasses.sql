SELECT
  q.id,
  q.title,
  q.true_or_false,
  q.correct_answer,
  q.incorrect_answer1,
  q.incorrect_answer2,
  q.incorrect_answer3,
  COALESCE(
    (
      SELECT array_agg(cq.class_id ORDER BY cq.class_id)
      FROM class_questions cq
      WHERE cq.question_id = q.id
    ),
    ARRAY[]::text[]
  ) AS class_ids
FROM questions q
ORDER BY q.id ASC
