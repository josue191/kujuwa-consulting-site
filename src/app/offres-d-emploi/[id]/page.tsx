'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';
import ApplicationForm from '@/components/jobs/ApplicationForm';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { format } from 'date-fns';

type JobPosting = {
  id: string;
  title: string;
  domain: string;
  location: string;
  description: string;
  created_at: string;
};

export default function JobDetailPage() {
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('jobPostings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching job details:', error);
          setJob(null);
        } else {
          setJob(data);
        }
        setIsLoading(false);
      };
      fetchJob();
    }
  }, [id, supabase]);

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-7xl py-12 sm:py-16">
            <Skeleton className="h-12 w-2/3 mx-auto" />
            <Skeleton className="h-6 w-1/3 mx-auto mt-4" />
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
      </div>
    );
  }

  if (!job) {
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
                    <ApplicationForm offers={[job]} selectedOfferId={job.id} />
                </div>
            </div>
         </div>
      </div>
    </>
  );
}
