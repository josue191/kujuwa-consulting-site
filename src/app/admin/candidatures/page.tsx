'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { format } from 'date-fns';

type Application = {
  id: string;
  name: string;
  jobPostingId: string;
  submittedAt: {
    seconds: number;
    nanoseconds: number;
  };
  status: string;
}

export default function CandidaturesPage() {
  const firestore = useFirestore();

  const applicationsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collectionGroup(firestore, 'applications'), orderBy('submittedAt', 'desc'));
  }, [firestore]);
  
  const { data: applications, isLoading } = useCollection<Application>(applicationsQuery);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Nouveau':
        return 'default';
      case 'En cours':
        return 'secondary';
      case 'Archivé':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getJobTitle = (jobPostingId: string) => {
    const titleMap: { [key: string]: string } = {
        'chef-de-projet-en-construction': 'Chef de Projet en Construction',
        'specialiste-en-suivi-evaluation': 'Spécialiste en Suivi & Évaluation',
        'gestionnaire-de-flotte-de-transport': 'Gestionnaire de Flotte de Transport',
    }
    return titleMap[jobPostingId] || jobPostingId;
  }

  return (
    <div className="w-full">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du candidat</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Date de soumission</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : applications && applications.length > 0 ? (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>{getJobTitle(application.jobPostingId)}</TableCell>
                  <TableCell>
                    {application.submittedAt
                      ? format(new Date(application.submittedAt.seconds * 1000), 'dd/MM/yyyy')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                    Aucune candidature pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
