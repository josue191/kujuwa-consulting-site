'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useRef } from 'react';

export default function Hero() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full md:h-[60vh]">
      <Carousel 
        plugins={[plugin.current]}
        className="h-full w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
           {heroContent.images.length > 0 ? (
            heroContent.images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
                 <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    priority={index === 0}
                />
            </CarouselItem>
            ))
           ) : (
             <CarouselItem className="h-full bg-muted" />
           )}
        </CarouselContent>
         <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white opacity-50 hover:opacity-100 disabled:opacity-30 md:left-8" />
         <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white opacity-50 hover:opacity-100 disabled:opacity-30 md:right-8" />
      </Carousel>
      
      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto max-w-4xl px-4 text-center text-primary-foreground">
          <h1 className="font-headline text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {heroContent.title}
          </h1>
           <p className="mt-4 text-base text-white/80 md:text-lg">
             Solutions intégrées pour la recherche, la construction, le transport et bien plus encore.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link href={heroContent.buttons.primary.href}>
                {heroContent.buttons.primary.label}
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="secondary"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href={heroContent.buttons.secondary.href}>
                {heroContent.buttons.secondary.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
