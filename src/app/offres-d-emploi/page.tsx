'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import JobListing from '@/components/jobs/JobListing';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { jobOffersContent } from '@/lib/data';

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
        <h2 className="font-headline text-3xl font-bold text-center mb-12">Postes actuellement ouverts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-1/3 mt-4" />
                </CardContent>
              </Card>
            ))
          ) : jobPostings.length > 0 ? (
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
