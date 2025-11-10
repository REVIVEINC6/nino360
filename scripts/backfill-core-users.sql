-- Backfill missing core.users from user_profiles
-- Inserts minimal rows (id, email, full_name) for any user_profiles that are missing in core.users
BEGIN;
INSERT INTO core.users (id, email, full_name)
SELECT up.id, up.email, COALESCE(NULLIF(CONCAT(up.first_name, ' ', up.last_name), ' '), up.email)
FROM public.user_profiles up
WHERE up.id NOT IN (SELECT id FROM core.users);
COMMIT;

-- End
