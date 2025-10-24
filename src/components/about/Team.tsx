import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { aboutUsContent } from '@/lib/data';

export default function Team() {
  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Notre Équipe</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Rencontrez les experts et les leaders qui pilotent notre mission.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {aboutUsContent.team.map((member) => (
          <Card
            key={member.name}
            className="overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {member.image && (
              <div className="relative h-64 w-full">
                <Image
                  src={member.image.imageUrl}
                  alt={`Photo de ${member.name}`}
                  fill
                  className="object-cover"
                  data-ai-hint={member.image.imageHint}
                />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-headline text-lg font-semibold">
                {member.name}
              </h3>
              <p className="text-sm text-primary">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
