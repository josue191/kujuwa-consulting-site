import PageHeader from '@/components/shared/PageHeader';
import JobListing from '@/components/jobs/JobListing';
import { createClient } from '@/lib/supabase/server';
import { jobOffersContent } from '@/lib/data';

type JobPosting = {
  id: string;
  title: string;
  domain: string;
  location: string;
  description: string;
  created_at: string;
};

export default async function JobOffersPage() {
  const supabase = createClient();
  const { data: jobPostings, error } = await supabase
    .from('jobPostings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching job offers:", error.message);
    // Render an error state or a message
  }

  return (
    <>
      <PageHeader
        title={jobOffersContent.title}
        description={jobOffersContent.description}
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <h2 className="font-headline text-3xl font-bold text-center mb-12">Postes actuellement ouverts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobPostings && jobPostings.length > 0 ? (
            jobPostings.map((offer) => (
              <JobListing key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground">
                <p>Il n'y a aucune offre d'emploi pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
