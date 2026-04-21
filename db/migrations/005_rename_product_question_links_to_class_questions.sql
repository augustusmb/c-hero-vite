-- Rename product_question_links → class_questions.
-- The `product_id` column never actually held product IDs — it held
-- composite class identifiers like `hr_b` (HR product + Operations class).
-- The column FK to `products(id)` never resolved, and the name misled
-- every new reader. Renaming table + column to reflect what's stored.

ALTER TABLE product_question_links RENAME COLUMN product_id TO class_id;
ALTER TABLE product_question_links RENAME TO class_questions;
