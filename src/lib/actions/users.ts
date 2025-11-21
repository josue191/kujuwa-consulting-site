'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function createAdminUser(values: z.infer<typeof formSchema>) {
    const supabaseAdmin = createAdminClient();

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
