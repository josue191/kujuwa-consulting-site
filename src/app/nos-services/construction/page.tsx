import PageHeader from '@/components/shared/PageHeader';
import { services } from '@/lib/data';
import { CheckCircle } from 'lucide-react';

export default function ConstructionPage() {
  const service = services.find((s) => s.id === 'construction');

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
