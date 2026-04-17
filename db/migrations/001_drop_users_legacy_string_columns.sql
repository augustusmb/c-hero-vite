-- Drop legacy string columns on users table.
-- These predate the move to foreign-key references:
--   name2   -> replaced by first_name + last_name
--   vessel2 -> replaced by vessel_id (FK to vessels.id)
--   port2   -> replaced by port_id   (FK to ports.id)

ALTER TABLE users DROP COLUMN name2;
ALTER TABLE users DROP COLUMN vessel2;
ALTER TABLE users DROP COLUMN port2;
