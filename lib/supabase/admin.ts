import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client — bypasses RLS. Only use in server-side code.
 * Requires SUPABASE_SERVICE_ROLE_KEY env var.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
