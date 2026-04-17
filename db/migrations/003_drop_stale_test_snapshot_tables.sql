-- Drop stale snapshot tables.
-- Both tables have identical schemas to their live counterparts
-- (`product_question_links`, `questions`), zero code references,
-- and no views/triggers depending on them. They appear to be
-- abandoned snapshots from earlier development, not part of the
-- real test-taking flow (which uses the non-suffixed tables).

DROP TABLE product_question_links_test;
DROP TABLE questions_test;
