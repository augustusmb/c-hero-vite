-- Drop legacy `title` column on users table.
-- Replaced by `position` (position_type enum: captain | crew | shoreside).
-- No live code path writes to `title`; the admin form renders `position`
-- and modern updateUserInfo.sql / signUpUserNew.sql both use `position`.

ALTER TABLE users DROP COLUMN title;
