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
import { MoreHorizontal, Loader2, Download, Trash2, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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

export default function CandidaturesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
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

  const handleDelete = async () => {
    if (!applicationToDelete) return;

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
      setApplications(applications.filter(app => app.id !== applicationToDelete.id));
    }
    setApplicationToDelete(null);
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
        <AlertDialog open={!!applicationToDelete} onOpenChange={() => setApplicationToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette candidature ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Elle supprimera définitivement la candidature et le CV associé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
