import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates a Supabase client with the service_role key for admin operations.
// It should only be used in Server Actions and Server Components where admin rights are required.
export function createAdminClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // The admin client is used for server-side operations and does not manage user sessions,
          // so we don't need to set cookies here.
        },
        remove(name: string, options: CookieOptions) {
          // The admin client is used for server-side operations and does not manage user sessions,
          // so we don't need to remove cookies here.
        },
      },
    }
  );
}
