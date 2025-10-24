import PageHeader from '@/components/shared/PageHeader';
import ContactForm from '@/components/contact/ContactForm';
import { quotePageContent } from '@/lib/data';

export default function QuotePage() {
  return (
    <>
      <PageHeader
        title={quotePageContent.title}
        description={quotePageContent.description}
      />
      <div className="container mx-auto max-w-3xl py-12 sm:py-16">
        <ContactForm />
      </div>
    </>
  );
}
