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

export default function Hero() {
  return (
    <section className="relative h-[60vh] min-h-[500px] w-full">
      {heroContent.images.length > 0 && (
        <Image
          src={heroContent.images[0].imageUrl}
          alt={heroContent.images[0].description}
          fill
          className="object-cover"
          data-ai-hint={heroContent.images[0].imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto max-w-4xl px-4 text-center text-primary-foreground">
          <h1 className="font-headline text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {heroContent.title}
          </h1>
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
