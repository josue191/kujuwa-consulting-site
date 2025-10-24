import { Mail, Phone, MapPin } from 'lucide-react';
import { contactDetails } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactCards() {
  const contacts = [
    {
      icon: Mail,
      title: 'Email',
      content: [contactDetails.email],
      href: `mailto:${contactDetails.email}`,
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: contactDetails.phones,
      href: `tel:${contactDetails.phones[0]}`,
    },
    {
      icon: MapPin,
      title: 'Kinshasa',
      content: [contactDetails.addresses[0].address],
    },
    {
      icon: MapPin,
      title: 'Goma',
      content: [contactDetails.addresses[1].address],
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {contacts.map((contact, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <a href={contact.href} className="group">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-card transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <contact.icon className="h-12 w-12" />
                </div>
              </a>
              <h3 className="mt-6 font-headline text-xl font-bold">
                {contact.title}
              </h3>
              <div className="mt-2 text-muted-foreground">
                {contact.content.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
