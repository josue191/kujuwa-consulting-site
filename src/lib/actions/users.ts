'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function createAdminUser(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Données invalides.' };
    }

    const { email, password } = validatedFields.data;

    // Utilisation de la méthode admin pour créer un utilisateur sans envoyer d'email d'invitation
    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Confirme automatiquement l'email pour que l'utilisateur puisse se connecter
    });

    if (error) {
        if (error.message.includes('User already exists')) {
            return { error: 'Un utilisateur avec cet email existe déjà.'};
        }
        return { error: `Impossible de créer l'utilisateur. ${error.message}` };
    }

    return { data, error: null };
}
