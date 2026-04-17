UPDATE
  users_products
SET
  completed = TRUE,
  date_completed = NOW()
WHERE
  user_id = ${userId}
  AND product_id = ${classId}