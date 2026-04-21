-- Add boolean is_admin column to users and backfill from legacy `level` gate.
-- `level = '0'` was the de-facto admin flag but nothing modern wrote to it;
-- granting admin required a manual UPDATE. Replaces that orphaned string
-- gate with a typed boolean. `level` column stays in place for now — its
-- remaining form-default references get cleaned up in a follow-up PR
-- (issue #12 / #2) before the column is dropped.

ALTER TABLE users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
UPDATE users SET is_admin = true WHERE level = '0';
