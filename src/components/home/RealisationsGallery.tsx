import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ImageIcon } from 'lucide-react';
import PhotoGalleryDialog from '@/components/realisations/PhotoGalleryDialog';

type PhotoWithProject = {
  id: string;
  photo_url: string;
  caption: string | null;
  projects: {
    title: string;
  } | null;
};

export default async function RealisationsGallery() {
  const supabase = createClient();

  // Fetch the 6 most recent realization photos along with their project title
  const { data: photos, error } = await supabase
    .from('project_photos')
    .select('id, photo_url, caption, projects(title)')
    .order('created_at', { ascending: false })
    .limit(6) as { data: PhotoWithProject[] | null, error: any };

  if (error) {
    console.error('Error fetching homepage photos:', error.message);
  }

  // If there are no photos yet, we won't render this section
  if (!photos || photos.length === 0) {
    return null;
  }

  // Format photos to fit the PhotoGalleryDialog format
  const galleryPhotos = photos.map(p => ({
    id: p.id,
    photo_url: p.photo_url,
    caption: p.caption
  }));

  return (
    <section className="bg-gradient-to-b from-card to-background py-16 sm:py-24 border-t border-b border-primary/5">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Sur le terrain
            </div>
            <h2 className="font-headline text-3xl font-bold md:text-4xl text-foreground">
              Nos réalisations en images
            </h2>
            <p className="text-base text-muted-foreground">
              Découvrez en images nos enquêtes, nos audits et nos interventions multisectorielles à travers la RDC.
            </p>
          </div>
          
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 group shrink-0">
            <Link href="/nos-realisations" className="inline-flex items-center gap-2">
              Voir tout le portfolio
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <Card key={photo.id} className="group relative overflow-hidden rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-300 h-72">
              <CardContent className="p-0 h-full w-full relative">
                <Image
                  src={photo.photo_url}
                  alt={photo.caption || 'Photo de réalisation'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300" />
                
                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-white">
                  {photo.projects?.title && (
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">
                      {photo.projects.title}
                    </span>
                  )}
                  <h3 className="font-headline font-semibold text-base line-clamp-2 leading-snug">
                    {photo.caption || 'Photo de réalisation'}
                  </h3>
                  
                  {/* Photo Gallery Link Trigger */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PhotoGalleryDialog 
                      photos={galleryPhotos} 
                      projectTitle="Kujuwa Consulting" 
                      trigger={
                        <button className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors">
                          <ImageIcon className="h-3.5 w-3.5" />
                          Agrandir la galerie ({photos.length})
                        </button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
