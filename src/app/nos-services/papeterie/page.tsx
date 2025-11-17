import PageHeader from '@/components/shared/PageHeader';
import { CheckCircle, Printer } from 'lucide-react';

const service = {
    id: 'papeterie',
    title: 'Fournitures et Papeterie',
    description: 'Fourniture de matériel de bureau et d\'articles de papeterie pour les entreprises et les organisations.',
    icon: Printer,
    subServices: [
        { title: 'Fournitures de bureau', description: 'Catalogue complet d\'articles de bureau, des stylos au papier.' },
        { title: 'Matériel informatique et consommables', description: 'Cartouches d\'encre, toners, et autres consommables informatiques.' },
        { title: 'Services d\'impression', description: 'Impression de documents, rapports, et supports de communication.' },
        { title: 'Personnalisation d\'objets', description: 'Marquage et personnalisation de vos articles de bureau et promotionnels.' }
    ]
};

export default function PapeteriePage() {
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
