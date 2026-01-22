import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates a Supabase client with the service_role key for admin operations.
// It should only be used in Server Actions and Server Components where admin rights are required.
export function createAdminClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("La variable d'environnement NEXT_PUBLIC_SUPABASE_URL est manquante. Veuillez l'ajouter à votre environnement de production.");
  }

  if (!serviceRoleKey) {
    throw new Error("La variable d'environnement SUPABASE_SERVICE_ROLE_KEY est manquante. Elle est requise pour les opérations d'administration. Veuillez l'ajouter à votre environnement de production.");
  }

  return createServerClient(
    supabaseUrl,
    serviceRoleKey,
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
