
import { createClient } from '@/lib/supabase/server';
import MessagesClient from '@/components/admin/MessagesClient';
import type { ContactSubmission } from '@/components/admin/MessagesClient';

const ITEMS_PER_PAGE = 10;

export default async function MessagesPage({ searchParams }: { searchParams?: { page?: string }}) {
  const supabase = createClient();
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 0;
  
  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('contactFormSubmissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching submissions:', error);
    return (
        <div className="w-full text-center py-16">
            <p className="text-destructive">Erreur de chargement des messages.</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
    )
  }

  return <MessagesClient submissions={data || []} totalSubmissions={count || 0} page={page} itemsPerPage={ITEMS_PER_PAGE} />
}
