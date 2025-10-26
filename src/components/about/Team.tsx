'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Team() {
  const teamMembers = [
    {
      id: 'team-1',
      name: 'John Doe',
      role: 'Directeur Général',
      imageHint: 'professional headshot',
    },
    {
      id: 'team-2',
      name: 'Jane Smith',
      role: 'Directrice des Opérations',
      imageHint: 'professional headshot',
    },
    {
      id: 'team-3',
      name: 'David Martin',
      role: 'Chef de projet senior',
      imageHint: 'professional headshot',
    },
    {
      id: 'team-4',
      name: 'Sarah Lee',
      role: 'Analyste Financier',
      imageHint: 'professional headshot',
    },
  ];

  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Notre Équipe</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Rencontrez les experts et les leaders qui pilotent notre mission.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => {
          const image = PlaceHolderImages.find((img) => img.id === member.id);
          return (
            <Card
              key={member.name}
              className="overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {image && (
                <div className="relative h-64 w-full">
                  <Image
                    src={image.imageUrl}
                    alt={`Photo de ${member.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={member.imageHint}
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
          );
        })}
      </div>
    </section>
  );
}
