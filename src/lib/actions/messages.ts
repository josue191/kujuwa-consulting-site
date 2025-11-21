'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMessages(page: number, pageSize: number) {
  const supabase = createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('contactFormSubmissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return { data: null, count: 0, error: error.message };
  }

  return { data, count, error: null };
}

export async function deleteMessage(id: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('contactFormSubmissions')
      .delete()
      .match({ id });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/messages');
    return { error: null };
}
