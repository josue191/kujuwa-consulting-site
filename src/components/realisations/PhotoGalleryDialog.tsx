'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

type Photo = {
  id: string;
  photo_url: string;
  caption: string | null;
};

type PhotoGalleryDialogProps = {
  photos: Photo[];
  projectTitle: string;
  trigger?: React.ReactNode;
};

export default function PhotoGalleryDialog({ photos, projectTitle, trigger }: PhotoGalleryDialogProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  if (!photos || photos.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const currentPhoto = photos[activeIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-full flex items-center gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary">
            <ImageIcon className="h-4 w-4" />
            Voir les photos ({photos.length})
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-[95vw] p-6 gap-6 sm:rounded-2xl border-primary/10">
        <DialogHeader className="pb-2 border-b border-muted">
          <DialogTitle className="font-headline text-xl text-foreground pr-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {projectTitle} — Photos de réalisation
          </DialogTitle>
        </DialogHeader>

        {/* Lightbox Main Container */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center group">
            {currentPhoto ? (
              <>
                <Image
                  src={currentPhoto.photo_url}
                  alt={currentPhoto.caption || projectTitle}
                  fill
                  className="object-contain transition-all duration-300"
                  sizes="(max-width: 900px) 95vw, 850px"
                  priority
                />
                
                {/* Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                  <p className="text-sm font-medium tracking-wide">
                    {currentPhoto.caption || `Photo de réalisation ${activeIndex + 1}`}
                  </p>
                  <span className="text-xs text-zinc-400 mt-1 block">
                    Image {activeIndex + 1} sur {photos.length}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-zinc-500 flex flex-col items-center gap-2">
                <ImageIcon className="h-12 w-12 text-zinc-600" />
                <p className="text-sm">Image non disponible</p>
              </div>
            )}

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-primary transition-all duration-200 border border-zinc-800 opacity-80 hover:opacity-100"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-primary transition-all duration-200 border border-zinc-800 opacity-80 hover:opacity-100"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails Row */}
          {photos.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {photos.map((photo, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={photo.id}
                    onClick={() => setActiveIndex(index)}
                    className={`relative flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive 
                        ? 'border-primary ring-2 ring-primary/20 scale-95' 
                        : 'border-zinc-200 hover:border-zinc-400 scale-100'
                    }`}
                  >
                    <Image
                      src={photo.photo_url}
                      alt={photo.caption || `Miniature ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-primary/10" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
