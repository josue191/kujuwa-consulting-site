import PageHeader from '@/components/shared/PageHeader';
import { services } from '@/lib/data';
import ServiceCard from '@/components/services/ServiceCard';

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Nos Services"
        description="Kujuwa Consulting offre une gamme complète de services pour répondre à vos besoins les plus complexes. Découvrez nos domaines d'expertise."
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </>
  );
}
