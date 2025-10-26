import { Card, CardContent } from '@/components/ui/card';
import { introContent, serviceIntros } from '@/lib/data';

export default function ServicesIntro() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-xl">
            {introContent.paragraph}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {serviceIntros.map((service) => (
            <Card
              key={service.name}
              className="group transform transition-transform duration-300 hover:-translate-y-2"
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <service.icon className="mb-4 h-10 w-10 text-primary transition-colors duration-300 group-hover:text-accent" />
                <h3 className="font-headline text-md font-semibold">
                  {service.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
