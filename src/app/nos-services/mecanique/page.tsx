import PageHeader from '@/components/shared/PageHeader';
import { CheckCircle, Wrench } from 'lucide-react';

const service = {
    id: 'mecanique',
    title: 'Mécanique et Entretien',
    description: 'Entretien et réparation de véhicules et d\'engins de chantier pour garantir la continuité de vos opérations.',
    icon: Wrench,
    subServices: [
        { title: 'Entretien préventif de flottes', description: 'Programmes de maintenance pour véhicules légers, lourds et engins de chantier.' },
        { title: 'Réparation mécanique générale', description: 'Diagnostic et réparation de pannes moteur, transmission, et autres systèmes.' },
        { title: 'Vente de pièces de rechange', description: 'Fourniture de pièces d\'origine et de qualité pour tous types de véhicules.' },
        { title: 'Assistance et dépannage', description: 'Intervention rapide pour les pannes sur site ou sur route.' }
    ]
};

export default function MecaniquePage() {
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
