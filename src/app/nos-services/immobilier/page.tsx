import PageHeader from '@/components/shared/PageHeader';
import { CheckCircle, Home } from 'lucide-react';

const service = {
    id: 'immobilier',
    title: 'Immobilier',
    description: 'Gestion, achat et vente de biens immobiliers avec une expertise locale approfondie pour sécuriser vos investissements.',
    icon: Home,
    subServices: [
        { title: 'Gestion locative', description: 'Administration complète de vos biens immobiliers pour une tranquillité d\'esprit.' },
        { title: 'Transaction immobilière', description: 'Accompagnement pour l\'achat, la vente ou la location de propriétés.' },
        { title: 'Conseil en investissement', description: 'Analyse du marché pour identifier les meilleures opportunités d\'investissement immobilier.' },
        { title: 'Expertise et évaluation', description: 'Estimation de la valeur de vos biens selon les standards du marché.' }
    ]
};

export default function ImmobilierPage() {
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
