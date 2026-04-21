-- Drop the legacy `users.level` column.
-- Admin gating moved to `users.is_admin` in migration 007. The numeric
-- values "1" / "2" / "3" (captain / shoreside / crew) are already
-- covered by the `position_type` enum, so `level` has no remaining
-- live meaning. The two dashboard SQL files that still filtered on
-- `level` (getDashboardUsersForCrew.sql, getDashboardUsersForCaptain.sql)
-- were orphaned and are removed in the same PR.

ALTER TABLE users DROP COLUMN IF EXISTS level;
