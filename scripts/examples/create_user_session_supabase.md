Supabase JS example: call the create_user_session RPC from a trusted server environment.

\`\`\`js
// server/createSession.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function createUserSession({ userId, tenantId, sessionToken, deviceFingerprint, ipAddress, userAgent, expiresAt }) {
  const { data, error } = await supabase.rpc('create_user_session', {
    p_user_id: userId,
    p_tenant_id: tenantId,
    p_session_token: sessionToken,
    p_device_fingerprint: deviceFingerprint,
    p_ip_address: ipAddress,
    p_user_agent: userAgent,
    p_expires_at: expiresAt
  });

  if (error) throw error;
  return data; // created session row
}
\`\`\`

Notes:
- Use a trusted key (service role) to call this RPC from server code, or grant EXECUTE to the DB role used by your server.
- If you prefer not to use the service key, use a node-postgres connection and set `app.current_user_id` in the same session.
