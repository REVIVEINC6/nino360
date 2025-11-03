node-postgres example: set the app.current_user_id in the same session and insert directly.

```js
// server/createSessionPg.js
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function createUserSessionPg({ userId, tenantId, sessionToken, deviceFingerprint, ipAddress, userAgent, expiresAt }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT set_config('app.current_user_id', $1, true)", [userId]);
    const res = await client.query(
      `INSERT INTO public.user_sessions (user_id, tenant_id, session_token, device_fingerprint, ip_address, user_agent, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [userId, tenantId, sessionToken, deviceFingerprint, ipAddress, userAgent, expiresAt]
    );
    await client.query('COMMIT');
    return res.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```

Notes:
- This approach uses the same DB session to set the Postgres setting and perform the insert so the RLS policy will allow it.
- Adjust connection pooling and error handling for your app.
