'use client';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ServiceCard from '@/components/services/ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string | null;
  created_at: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error.message);
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: 'Impossible de récupérer les services.',
        });
      } else {
        setServices(data || []);
      }
      setIsLoading(false);
    };

    fetchServices();
  }, [supabase, toast]);


  return (
    <>
      <PageHeader
        title="Nos Services"
        description="Kujuwa Consulting offre une gamme complète de services pour répondre à vos besoins les plus complexes. Découvrez nos domaines d'expertise."
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                    <Skeleton className="h-48 w-full" />
                    <CardHeader className="flex-row items-start gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-5 w-40" />
                           <Skeleton className="h-4 w-48" />
                        </div>
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-10 w-24" />
                    </CardContent>
              </Card>
            ))
          ) : services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground">
                <p>Aucun service n'est disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
