import PageHeader from '@/components/shared/PageHeader';
import { CheckCircle, HardHat } from 'lucide-react';

const service = {
    id: 'construction',
    title: 'Construction',
    description: 'Réalisation de projets de construction (bâtiments, routes) en respectant les normes de qualité et de durabilité.',
    icon: HardHat,
    subServices: [
        { title: 'Conception et planification (BTP)', description: 'Élaboration de plans architecturaux et techniques pour des projets de toute envergure.' },
        { title: 'Construction de bâtiments', description: 'Réalisation de constructions résidentielles, commerciales et industrielles.' },
        { title: 'Travaux publics et infrastructures', description: 'Construction de routes, ponts, et autres infrastructures essentielles.' },
        { title: 'Rénovation et réhabilitation', description: 'Modernisation et mise aux normes de bâtiments existants.' }
    ]
};

export default function ConstructionPage() {
  if (!service) return null;

  return (
    <>
      <PageHeader title={service.title} description={service.description} />
       <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <h2 className="font-headline text-2xl font-bold">Nos prestations</h2>
        <ul className="mt-6 space-y-4">
          {service.subServices.map((sub, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{sub.title}</h3>
                <p className="text-muted-foreground">{sub.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
