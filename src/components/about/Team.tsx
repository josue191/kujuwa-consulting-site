'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { UserSquare } from 'lucide-react';


type TeamMember = {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
};

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching team members:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: "Impossible de récupérer l'équipe.",
        });
      } else {
        setTeamMembers(data || []);
      }
      setIsLoading(false);
    };

    fetchTeamMembers();
  }, [supabase, toast]);


  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Notre Équipe</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Rencontrez les experts et les leaders qui pilotent notre mission.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden text-center">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))
          : teamMembers.map((member) => (
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
          ))}
      </div>
       {(!isLoading && teamMembers.length === 0) && (
          <div className="mt-12 text-center text-muted-foreground">
              <p>Les membres de l'équipe seront bientôt affichés ici.</p>
          </div>
        )}
    </section>
  );
}
