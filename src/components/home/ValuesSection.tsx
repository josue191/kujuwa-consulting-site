import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { valuesContent } from '@/lib/data';

export default function ValuesSection() {
  return (
    <section className="bg-card py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            {valuesContent.title}
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {valuesContent.values.map((value) => (
            <Card
              key={value.id}
              className="transform text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <value.icon className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="font-headline text-xl">
                  {value.title}
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
