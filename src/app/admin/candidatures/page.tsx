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
import { MoreHorizontal, Loader2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { jobOffersContent } from '@/lib/data';

type Application = {
  id: string;
  name: string;
  job_posting_id: string;
  created_at: string;
  status: string;
  cv_url: string;
};

// Create a mapping from job ID to job title for easy lookup
const jobTitles = jobOffersContent.offers.reduce((acc, offer) => {
  acc[offer.id] = offer.title;
  return acc;
}, {} as Record<string, string>);


export default function CandidaturesPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const { toast } = useToast();

    useEffect(() => {
       const fetchApplications = async () => {
         setIsLoading(true);
         const { data, error } = await supabase
           .from('applications')
           .select('*')
           .order('created_at', { ascending: false });

         if (error) {
           console.error('Error fetching applications:', error.message);
           toast({
             variant: 'destructive',
             title: 'Erreur de chargement',
             description: `Une erreur est survenue: ${error.message}`,
           });
         } else {
           setApplications(data || []);
         }
         setIsLoading(false);
       };

       fetchApplications();
    }, [supabase, toast]);


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
              <TableHead>CV</TableHead>
              <TableHead>Date de soumission</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : applications && applications.length > 0 ? (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>{jobTitles[application.job_posting_id] || application.job_posting_id}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={application.cv_url} target="_blank" rel="noopener noreferrer" aria-label="Télécharger le CV">
                            <Download className="h-4 w-4" />
                        </a>
                    </Button>
                  </TableCell>
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
                <TableCell colSpan={6} className="text-center h-24">
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
