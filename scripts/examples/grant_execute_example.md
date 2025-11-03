GRANT example: grant execute on the RPC function to your server DB role (e.g., service_role)

```sql
-- Run in psql as a superuser or owner of the function
GRANT EXECUTE ON FUNCTION public.create_user_session(uuid, uuid, text, text, inet, text, timestamptz, timestamptz) TO service_role;
```

If your server uses a different role name, replace `service_role` accordingly.
