import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { UserSquare } from 'lucide-react';


type TeamMember = {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
};

export default async function Team() {
  const supabase = createClient();
  const { data: teamMembers, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error.message);
  }

  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Notre Équipe</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Rencontrez les experts et les leaders qui pilotent notre mission.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-64 w-full bg-muted">
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={`Photo de ${member.name}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <UserSquare className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold">
                  {member.name}
                </h3>
                <p className="text-sm text-primary">{member.role}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 mt-12 text-center text-muted-foreground">
              <p>Les membres de l'équipe seront bientôt affichés ici.</p>
          </div>
        )}
      </div>
    </section>
  );
}
