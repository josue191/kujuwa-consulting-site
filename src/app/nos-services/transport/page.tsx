import PageHeader from '@/components/shared/PageHeader';
import { CheckCircle, Truck } from 'lucide-react';

const service = {
    id: 'transport',
    title: 'Transport et Logistique',
    description: 'Solutions de transport fiables et optimisées pour vos marchandises et matériels, partout en RDC.',
    icon: Truck,
    subServices: [
        { title: 'Transport de marchandises', description: 'Acheminement sécurisé de vos biens et produits sur l\'ensemble du territoire.' },
        { title: 'Location d\'engins de chantier', description: 'Mise à disposition de matériel BTP pour vos projets de construction.' },
        { title: 'Logistique de projet', description: 'Gestion complète de la chaîne logistique pour vos projets complexes.' },
        { title: 'Dédouanement et formalités', description: 'Prise en charge des procédures douanières pour l\'import-export.' }
    ]
};

export default function TransportPage() {
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
