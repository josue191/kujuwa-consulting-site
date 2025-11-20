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
import { Download, Search, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import SearchForm from '@/components/realisations/SearchForm';

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

export default async function RealisationsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const supabase = createClient();
  const searchTerm = searchParams?.query || '';

  let query = supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false });

  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  const { data: projects, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error.message);
    // You might want to render an error state here
  }

  return (
    <>
      <PageHeader
        title={realisationsContent.title}
        description={realisationsContent.description}
      />
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="mb-12 flex flex-col items-center gap-4 md:flex-row">
          <SearchForm placeholder="Rechercher par projet, domaine..." />
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
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
                <p>
                  {searchTerm 
                    ? `Aucun projet ne correspond à votre recherche "${searchTerm}".`
                    : "Aucun projet n'a été trouvé."
                  }
                </p>
            </div>
        )}
      </div>
    </>
  );
}
