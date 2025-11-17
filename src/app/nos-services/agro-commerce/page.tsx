import PageHeader from '@/components/shared/PageHeader';
import { CheckCircle, Wheat } from 'lucide-react';

const service = {
  id: 'agro-commerce',
  title: 'Agro-Commerce',
  description: 'Facilitation du commerce de produits agricoles, de la production à la commercialisation, pour soutenir les filières locales.',
  icon: Wheat,
  subServices: [
    { title: 'Étude de filières agricoles', description: 'Analyse des chaînes de valeur pour identifier les opportunités et les goulots d\'étranglement.' },
    { title: 'Mise en relation d\'acteurs', description: 'Connexion entre producteurs, transformateurs et distributeurs pour des partenariats fructueux.' },
    { title: 'Logistique et distribution', description: 'Solutions de transport et de stockage adaptées aux produits agricoles.' },
    { title: 'Accès au marché', description: 'Stratégies pour pénétrer de nouveaux marchés locaux et régionaux.' }
  ]
};

export default function AgroCommercePage() {
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
