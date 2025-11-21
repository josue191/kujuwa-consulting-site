'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function createAdminUser(values: z.infer<typeof formSchema>) {
    const cookieStore = cookies();

    // IMPORTANT: This client uses the service_role key for admin operations
    const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              // This is a server action, so we don't need to set cookies
              // as the admin client won't be authenticating a user session here.
            },
            remove(name: string, options: CookieOptions) {
               // This is a server action, so we don't need to remove cookies.
            },
          },
        }
    );

    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Données invalides.' };
    }

    const { email, password } = validatedFields.data;

    // Use the admin client to create a user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Automatically confirm the email
    });

    if (error) {
        if (error.message.includes('User already exists')) {
            return { error: 'Un utilisateur avec cet email existe déjà.'};
        }
        return { error: `Impossible de créer l'utilisateur. ${error.message}` };
    }

    return { data, error: null };
}
