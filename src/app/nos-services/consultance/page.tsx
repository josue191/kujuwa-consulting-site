import PageHeader from '@/components/shared/PageHeader';
import { CheckCircle, BrainCircuit } from 'lucide-react';

const service = {
  id: 'consultance',
  title: 'Consultance et Mentorat',
  description: 'Accompagnement stratégique pour vos projets, de la conception à la réalisation, avec un focus sur la recherche et l\'évaluation.',
  icon: BrainCircuit,
  subServices: [
    { title: 'Suivi et évaluation de projets', description: 'Mise en place de systèmes de suivi pour mesurer la performance et l\'impact de vos initiatives.' },
    { title: 'Recherche et études de marché', description: 'Collecte et analyse de données pour éclairer vos décisions stratégiques.' },
    { title: 'Planification stratégique', description: 'Développement de feuilles de route claires pour atteindre vos objectifs à long terme.' },
    { title: 'Renforcement des capacités', description: 'Formation et coaching pour améliorer les compétences de vos équipes.' }
  ]
};

export default function ConsultancePage() {
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
