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
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
        console.error('Error fetching projects:', error.message);
      } else {
        setProjects(data || []);
        setFilteredProjects(data || []);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, [supabase, toast]);

  useEffect(() => {
    const results = projects.filter(project => {
        const term = searchTerm.toLowerCase();
        return (
            project.title.toLowerCase().includes(term) ||
            (project.category && project.category.toLowerCase().includes(term)) ||
            (project.description && project.description.toLowerCase().includes(term))
        );
    });
    setFilteredProjects(results);
  }, [searchTerm, projects]);


  return (
    <>
      <PageHeader
        title={realisationsContent.title}
        description={realisationsContent.description}
      />
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="mb-12 flex flex-col items-center gap-4 md:flex-row">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
                placeholder="Rechercher par projet, domaine..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="flex flex-col">
                    <Skeleton className="h-56 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-36" />
                    </CardFooter>
                </Card>
             ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 w-full bg-muted">
                    {project.image_url ? (
                        <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <ArrowRight className="h-20 w-20 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    {project.title}
                  </CardTitle>
                  <div className="text-sm font-semibold text-primary">{project.category} - {project.year}</div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  {project.report_url && (
                    <Button asChild size="lg">
                      <a href={project.report_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger le rapport
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="py-16 text-center text-muted-foreground">
                <p>Aucun projet ne correspond à votre recherche "{searchTerm}".</p>
            </div>
        )}
      </div>
    </>
  );
}
