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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {detailedServices.map((service, index) => (
            <Card
              key={index}
              className="flex items-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="flex items-start gap-4 p-0">
                <service.icon className="h-10 w-10 flex-shrink-0 text-primary mt-1" />
                <span className="text-md text-foreground">{service.text}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
