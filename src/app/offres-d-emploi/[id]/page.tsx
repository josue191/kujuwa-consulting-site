import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/shared/PageHeader';
import ApplicationForm from '@/components/jobs/ApplicationForm';
import { Separator } from '@/components/ui/separator';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Metadata } from 'next';

type JobPosting = {
  id: string;
  title: string;
  domain: string;
  location: string;
  description: string;
  created_at: string;
};

type Props = {
  params: { id: string };
};

// Function to generate metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: job } = await supabase
    .from('jobPostings')
    .select('title, description')
    .eq('id', params.id)
    .single();

  if (!job) {
    return {
      title: 'Offre non trouvée',
    };
  }

  return {
    title: `${job.title} | Kujuwa Consulting`,
    description: job.description.substring(0, 160),
  };
}


export default async function JobDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: job, error } = await supabase
    .from('jobPostings')
    .select('*')
    .eq('id', params.id)
    .single();
  
  // Also fetch all jobs for the application form dropdown
  const { data: allJobs } = await supabase.from('jobPostings').select('id, title');


  if (error || !job) {
    console.error('Error fetching job details:', error);
    return (
      <>
        <PageHeader title="Offre non trouvée" description="Désolé, l'offre d'emploi que vous cherchez n'existe pas ou n'est plus disponible." />
      </>
    );
  }

  return (
    <>
      <PageHeader title={job.title} />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="md:col-span-2">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mb-8">
                     <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        <span>{job.domain}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>Publiée le {format(new Date(job.created_at), 'dd/MM/yyyy')}</span>
                    </div>
                </div>

                <h2 className="font-headline text-2xl font-bold mb-4">Description du poste</h2>
                <div className="prose prose-lg max-w-none text-foreground/80 whitespace-pre-wrap">
                    {job.description}
                </div>
            </div>
             <div className="md:col-span-1">
                <div className="sticky top-24">
                    <h2 className="font-headline text-2xl font-bold">
                    Postuler pour ce poste
                    </h2>
                    <Separator className="my-6" />
                    <ApplicationForm offers={allJobs || []} selectedOfferId={job.id} />
                </div>
            </div>
         </div>
      </div>
    </>
  );
}
