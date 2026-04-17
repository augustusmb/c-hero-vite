-- Drop abandoned sandbox table.
-- Contained 14 rows of obvious scratch data ("hi hi hi@hi.com"...).
-- Zero code references, no views/triggers. Schema was a cleaned-up
-- copy of `users` (no legacy columns), sharing the `users_id_seq`
-- sequence — looks like a developer sandbox that was never cleaned up.

DROP TABLE test_users_full;
