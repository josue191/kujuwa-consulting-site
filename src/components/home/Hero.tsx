
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/data';

export default function Hero() {
  return (
    <section className="relative h-[60vh] min-h-[500px] w-full">
      <Carousel
        className="h-full w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {heroContent.images.map((img, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  fill
                  className="object-cover"
                  data-ai-hint={img.imageHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/70" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-center text-white md:block">
          <CarouselPrevious className="absolute left-[-80px] top-1/2 -translate-y-1/2 scale-125 bg-white/20 text-white hover:bg-white/30" />
          <CarouselNext className="absolute right-[-80px] top-1/2 -translate-y-1/2 scale-125 bg-white/20 text-white hover:bg-white/30" />
        </div>
      </Carousel>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto max-w-4xl px-4 text-center text-primary-foreground">
          <h1 className="font-headline text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
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
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
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
