-- Fix questions.true_or_false column type.
-- The column was declared boolean in init SQL but has always been varchar in
-- the live DB, storing mixed-case strings: 'TRUE' (150), 'FALSE' (9), 'true' (1),
-- and 1 NULL. TypeScript code treated the field as boolean, so every non-null
-- string value read as truthy in the admin UI. Migrating to a real boolean so
-- schema, code, and data finally agree.

ALTER TABLE questions
  ALTER COLUMN true_or_false TYPE boolean
  USING (
    CASE
      WHEN UPPER(true_or_false) = 'TRUE' THEN true
      WHEN UPPER(true_or_false) = 'FALSE' THEN false
      ELSE NULL
    END
  );
