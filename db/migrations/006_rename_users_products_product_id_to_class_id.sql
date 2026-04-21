-- Rename users_products.product_id → class_id.
-- Same smell as migration 005: the column never held product IDs,
-- it held composite class identifiers like `3b_a`, `vr_p` (product + class letter).
-- The declared FK to products(id) doesn't resolve in the live DB (never enforced)
-- because those composite values aren't real product IDs.

ALTER TABLE users_products RENAME COLUMN product_id TO class_id;
