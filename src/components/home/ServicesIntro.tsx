'use client';
import { introContent } from '@/lib/data';
import {
  ClipboardList,
  Database,
  Users,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const detailedServices = [
  {
    text: 'Consultance en recherche et étude, suivi et évaluation des projets et programmes',
    icon: ClipboardList,
  },
  {
    text: 'Consultance en collecte, analyse, traitement des données, en cartographie et design/infographie',
    icon: Database,
  },
  {
    text: 'Formation professionnelle et renforcement des capacités en Suivi & Evaluation, en Analyse et traitement des données',
    icon: Users,
  },
  {
    text: 'Consultance en audit comptable et contrôle',
    icon: ShieldCheck,
  },
  {
    text: 'Consultance en Communication & Gestion de l’information',
    icon: Megaphone,
  },
];

export default function ServicesIntro() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-xl">
            {introContent.paragraph}
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full mt-12"
        >
          <CarouselContent>
            {detailedServices.map((service, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card
                    className="flex items-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full"
                  >
                    <CardContent className="flex items-start gap-4 p-0">
                      <service.icon className="h-10 w-10 flex-shrink-0 text-primary mt-1" />
                      <span className="text-md text-foreground">
                        {service.text}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex"/>
        </Carousel>
      </div>
    </section>
  );
}
