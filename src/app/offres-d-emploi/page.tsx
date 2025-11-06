import PageHeader from '@/components/shared/PageHeader';
import { jobOffersContent } from '@/lib/data';
import JobListing from '@/components/jobs/JobListing';
import ApplicationForm from '@/components/jobs/ApplicationForm';
import { Separator } from '@/components/ui/separator';

export default function JobOffersPage() {
  return (
    <>
      <PageHeader
        title={jobOffersContent.title}
        description={jobOffersContent.description}
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="font-headline text-2xl font-bold">Postes ouverts</h2>
            <div className="mt-6 space-y-6">
              {jobOffersContent.offers.map((offer, index) => (
                <JobListing key={index} offer={offer} />
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-headline text-2xl font-bold">
              Postuler maintenant
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sélectionnez un poste et remplissez le formulaire pour envoyer votre candidature.
            </p>
            <Separator className="my-6" />
            <ApplicationForm />
          </div>
        </div>
      </div>
    </>
  );
}
