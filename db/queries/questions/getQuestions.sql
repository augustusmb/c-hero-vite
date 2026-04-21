SELECT
  *
FROM
  questions
WHERE
  questions.id IN (
    SELECT
      question_id
    FROM
      class_questions
    WHERE
      class_id = ${classId}
  )