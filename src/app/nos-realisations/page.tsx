'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageHeader from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { realisationsContent } from '@/lib/data';
import { Download, Search, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Project = {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string;
  image_url: string | null;
  report_url: string | null;
  created_at: string;
};

export default function RealisationsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les projets.',
        });
        console.error(error);
      } else {
        setProjects(data);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <>
      <PageHeader
        title={realisationsContent.title}
        description={realisationsContent.description}
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <div className="mb-12 flex flex-col items-center gap-4 md:flex-row">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Rechercher par projet, domaine..." className="pl-10" />
          </div>
          {/* Add filter dropdowns here if needed */}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                    <Skeleton className="h-56 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-36" />
                    </CardFooter>
                </Card>
             ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {project.image_url && (
                  <div className="relative h-56 w-full bg-muted">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    {project.title}
                  </CardTitle>
                  <div className="text-sm text-primary font-semibold">{project.category} - {project.year}</div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="link" className="p-0">Voir détails <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  {project.report_url && (
                    <Button asChild>
                      <a href={project.report_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Rapport
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p>Aucun projet à afficher pour le moment.</p>
            </div>
        )}
      </div>
    </>
  );
}
