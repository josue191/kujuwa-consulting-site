'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/data';

export default function Hero() {
  const heroImage = heroContent.images[0];

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full md:h-[60vh]">
      {heroImage ? (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      
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
