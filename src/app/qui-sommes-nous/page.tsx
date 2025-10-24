import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aboutUsContent } from '@/lib/data';
import Team from '@/components/about/Team';
import { CheckCircle } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <>
      <PageHeader
        title="Qui sommes-nous ?"
        description="Découvrez notre histoire, notre vision et l'équipe passionnée derrière Kujuwa Consulting."
      />
      <div className="container mx-auto max-w-7xl py-12 sm:py-16">
        <div className="space-y-16">
          <section>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    Notre Histoire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {aboutUsContent.history}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    Notre Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {aboutUsContent.vision}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Notre Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {aboutUsContent.mission}
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="text-center">
            <h2 className="font-headline text-3xl font-bold">Nos Valeurs</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {aboutUsContent.values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2 rounded-lg bg-card p-4"
                >
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <Team />

          <section className="text-center">
            <blockquote className="mx-auto max-w-3xl text-2xl font-semibold italic text-foreground">
              {aboutUsContent.motto}
            </blockquote>
          </section>
        </div>
      </div>
    </>
  );
}
