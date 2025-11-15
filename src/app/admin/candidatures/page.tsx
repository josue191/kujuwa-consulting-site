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
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type Application = {
  id: string;
  name: string;
  jobPostings: { title: string } | null;
  created_at: string;
  status: string;
};

const mockApplications: Application[] = [
  {
    id: '1',
    name: 'Alice Dupont',
    jobPostings: { title: 'Chef de Projet en Construction' },
    created_at: new Date().toISOString(),
    status: 'Nouveau',
  },
  {
    id: '2',
    name: 'Bob Martin',
    jobPostings: { title: 'Spécialiste en Suivi & Évaluation' },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'En cours',
  },
  {
    id: '3',
    name: 'Claire Leroy',
    jobPostings: { title: 'Gestionnaire de Flotte de Transport' },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Archivé',
  },
];

export default function CandidaturesPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating data fetching
        const timer = setTimeout(() => {
            setApplications(mockApplications);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


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
                  <TableCell>{application.jobPostings?.title || 'N/A'}</TableCell>
                  <TableCell>
                    {application.created_at
                      ? format(new Date(application.created_at), 'dd/MM/yyyy')
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
