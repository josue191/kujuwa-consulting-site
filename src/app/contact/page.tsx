import PageHeader from '@/components/shared/PageHeader';
import { contactPageContent, contactDetails } from '@/lib/data';
import ContactForm from '@/components/contact/ContactForm';
import MapSection from '@/components/contact/MapSection';
import { Mail, Phone, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={contactPageContent.title}
        description={contactPageContent.description}
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-5">
          <div className="md:col-span-3">
            <ContactForm />
          </div>
          <div className="md:col-span-2 space-y-8">
            <h3 className="font-headline text-2xl font-bold">Nos Coordonnées</h3>
            <div className="space-y-4 text-lg">
                <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <a href={`mailto:${contactDetails.email}`} className="hover:text-primary transition-colors">{contactDetails.email}</a>
                </div>
                 <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        {contactDetails.phones.map(phone => (
                            <a key={phone} href={`tel:${phone}`} className="block hover:text-primary transition-colors">{phone}</a>
                        ))}
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span>{contactPageContent.openingHours}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      <MapSection />
    </>
  );
}
