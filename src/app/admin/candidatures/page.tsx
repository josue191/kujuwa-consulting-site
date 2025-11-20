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
import { MoreHorizontal, Loader2, Download, Trash2, Mail, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  job_posting_id: string;
  motivation: string;
  created_at: string;
  status: string;
  cv_url: string;
};

const ITEMS_PER_PAGE = 10;

export default function CandidaturesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();
  const { toast } = useToast();

  const fetchApplications = async (page: number) => {
      setIsLoading(true);
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching applications:', error.message);
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: `Une erreur est survenue: ${error.message}`,
        });
      } else {
        setApplications(data || []);
        setTotalApplications(count || 0);
      }
      setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage]);

  const handleDelete = async () => {
    if (!applicationToDelete) return;

    startTransition(async () => {
      // 1. Delete the CV file from storage
      const cvUrl = applicationToDelete.cv_url;
      const fileName = cvUrl.split('/').pop();

      if (fileName) {
          const { error: storageError } = await supabase.storage
              .from('cvs')
              .remove([fileName]);
          
          if (storageError) {
              console.error("Error deleting CV file:", storageError.message);
              toast({
                  variant: 'destructive',
                  title: 'Erreur de suppression du CV',
                  description: `Le fichier CV n'a pas pu être supprimé : ${storageError.message}`,
              });
              setApplicationToDelete(null);
              return;
          }
      }

      // 2. Delete the application record from the table
      const { error: dbError } = await supabase
        .from('applications')
        .delete()
        .match({ id: applicationToDelete.id });

      if (dbError) {
        toast({
          variant: 'destructive',
          title: 'Erreur de suppression',
          description: `La candidature n'a pas pu être supprimée: ${dbError.message}`,
        });
      } else {
        toast({
          title: 'Candidature supprimée',
          description: 'La candidature a été supprimée avec succès.',
        });
        
        const newTotalPages = Math.ceil((totalApplications - 1) / ITEMS_PER_PAGE);
        const newCurrentPage = Math.min(currentPage, Math.max(0, newTotalPages - 1));

        if (newCurrentPage !== currentPage) {
            setCurrentPage(newCurrentPage);
        } else {
            fetchApplications(newCurrentPage);
        }
      }
      setApplicationToDelete(null);
    });
  };

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
  
  const totalPages = Math.ceil(totalApplications / ITEMS_PER_PAGE);

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
                <TableRow key={application.id} onClick={() => setSelectedApplication(application)} className="cursor-pointer">
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>{application.job_posting_id}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-500"
                          onSelect={() => setApplicationToDelete(application)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} sur {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 0}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Précédent
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= totalPages - 1}
            >
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      )}


       {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="break-words">Candidature pour: {selectedApplication.job_posting_id}</DialogTitle>
                    <DialogDescription>
                        De {selectedApplication.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                           <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${selectedApplication.email}`} className="text-sm text-primary hover:underline break-all">
                                {selectedApplication.email}
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${selectedApplication.phone}`} className="text-sm text-primary hover:underline break-all">
                                {selectedApplication.phone}
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-muted-foreground" />
                             <a href={selectedApplication.cv_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                Télécharger le CV
                             </a>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Lettre de motivation</h4>
                        <div className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap break-words border max-h-[30vh] overflow-y-auto">
                            {selectedApplication.motivation}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="text-xs text-muted-foreground text-right w-full">
                        Reçu le {format(new Date(selectedApplication.created_at), "dd MMMM yyyy 'à' HH:mm")}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {applicationToDelete && (
          <DeleteConfirmationDialog
            isOpen={!!applicationToDelete}
            onOpenChange={() => setApplicationToDelete(null)}
            onConfirm={handleDelete}
            title="Êtes-vous sûr de vouloir supprimer cette candidature ?"
            description="Cette action est irréversible. Elle supprimera définitivement la candidature et le CV associé."
            isPending={isPending}
          />
      )}
    </div>
  );
}
