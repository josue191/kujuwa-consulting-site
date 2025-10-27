import { introContent } from '@/lib/data';
import { CheckCircle } from 'lucide-react';

const detailedServices = [
  'Consultance en recherche et étude, suivi et évaluation des projets et programmes ;',
  'Consultance en collecte, analyse, traitement des données, en cartographie et design/ infographie;',
  'Formation professionnelle et renforcement des capacités en Suivi & Evaluation, en Analyse et traitement des données ;',
  'Consultance en audit comptable et contrôle ;',
  'Consultance en Communication & Gestion de l’information ;',
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
        <div className="mt-12 max-w-4xl mx-auto">
          <ul className="space-y-4">
            {detailedServices.map((service, index) => (
              <li key={index} className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
