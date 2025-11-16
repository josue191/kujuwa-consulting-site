'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { jobOffersContent } from '@/lib/data';
import JobListing from '@/components/jobs/JobListing';
import ApplicationForm from '@/components/jobs/ApplicationForm';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type JobPosting = {
  id: string;
  title: string;
  domain: string;
  location: string;
  description: string;
  created_at: string;
};

export default function JobOffersPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobPostings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error.message);
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: "Impossible de récupérer les offres d'emploi.",
        });
      } else {
        setJobPostings(data || []);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, [supabase, toast]);

  return (
    <>
      <PageHeader
        title={jobOffersContent.title}
        description={jobOffersContent.description}
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="font-headline text-2xl font-bold">Postes ouverts</h2>
            <div className="mt-6 space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : jobPostings.length > 0 ? (
                jobPostings.map((offer) => (
                  <JobListing key={offer.id} offer={offer} />
                ))
              ) : (
                <p className="text-muted-foreground">Il n'y a aucune offre d'emploi pour le moment.</p>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-headline text-2xl font-bold">
              Postuler maintenant
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sélectionnez un poste et remplissez le formulaire pour envoyer votre candidature.
            </p>
            <Separator className="my-6" />
            <ApplicationForm offers={jobPostings} />
          </div>
        </div>
      </div>
    </>
  );
}
