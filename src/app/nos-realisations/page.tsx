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
import { Download, Search } from 'lucide-react';

export default function RealisationsPage() {
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {realisationsContent.projects.map((project, index) => (
            <Card key={index} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {project.image && (
                <div className="relative h-56 w-full">
                  <Image
                    src={project.image.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint={project.image.imageHint}
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
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
              <CardFooter className="gap-2">
                <Button>Voir détails</Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger rapport
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
