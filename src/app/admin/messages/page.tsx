'use client';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function MessagesPage() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('contactFormSubmissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching submissions:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: 'Impossible de récupérer les messages.',
        });
      } else {
        setSubmissions(data || []);
        setTotalSubmissions(count || 0);
      }
      setIsLoading(false);
    };

    fetchSubmissions();
  }, [supabase, toast, currentPage]);

  const handleDelete = async () => {
    if (!submissionToDelete) return;

    const { error } = await supabase
      .from('contactFormSubmissions')
      .delete()
      .match({ id: submissionToDelete.id });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de suppression',
        description: 'Le message n\'a pas pu être supprimé.',
      });
    } else {
      toast({
        title: 'Message supprimé',
        description: 'Le message a été supprimé avec succès.',
      });
      // Rafraîchir les données
      const from = currentPage * ITEMS_PER_PAGE;
      const { data, count } = await supabase.from('contactFormSubmissions').select('*', { count: 'exact' }).range(from, from + ITEMS_PER_PAGE - 1).order('created_at', { ascending: false });
      setSubmissions(data || []);
      setTotalSubmissions(count || 0);

      // Si c'était le dernier élément de la page, revenir à la page précédente
      if (submissions.length === 1 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    }
    setSubmissionToDelete(null);
  };
  
  const totalPages = Math.ceil(totalSubmissions / ITEMS_PER_PAGE);

  const PaginationControls = () => (
     totalPages > 1 && (
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
      )
  );

  return (
    <div className="w-full">
      {/* Affichage sur grand écran */}
      <div className="hidden md:block">
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    </TableCell>
                </TableRow>
                ) : submissions && submissions.length > 0 ? (
                submissions.map((submission) => (
                    <TableRow key={submission.id} onClick={() => setSelectedSubmission(submission)} className="cursor-pointer">
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>
                        {submission.created_at
                        ? format(new Date(submission.created_at), 'dd/MM/yyyy HH:mm')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem
                            className="text-red-500"
                            onSelect={() => setSubmissionToDelete(submission)}
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
                    <TableCell colSpan={4} className="text-center h-24">
                        Aucun message pour le moment.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        <PaginationControls />
      </div>

      {/* Affichage sur petit écran (mobile) */}
      <div className="md:hidden space-y-4">
         {isLoading ? (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
         ) : submissions && submissions.length > 0 ? (
            <>
            {submissions.map((submission) => (
                <Card key={submission.id} onClick={() => setSelectedSubmission(submission)} className="cursor-pointer hover:bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-base break-words">{submission.subject}</CardTitle>
                        <CardDescription>De : {submission.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground truncate">{submission.message}</p>
                    </CardContent>
                    <div className="flex justify-between items-center px-6 pb-4 text-xs text-muted-foreground">
                        <span>{submission.email}</span>
                        <span>
                            {submission.created_at
                            ? format(new Date(submission.created_at), 'dd/MM/yy')
                            : 'N/A'}
                        </span>
                    </div>
                </Card>
            ))}
            <PaginationControls />
            </>
         ) : (
            <div className="text-center p-8 text-muted-foreground">
                Aucun message pour le moment.
            </div>
         )}
      </div>


      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="break-words">{selectedSubmission.subject}</DialogTitle>
                    <DialogDescription>
                        Message de {selectedSubmission.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary">Email</Badge>
                        <a href={`mailto:${selectedSubmission.email}`} className="text-sm text-primary hover:underline break-all">
                            {selectedSubmission.email}
                        </a>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Message</h4>
                        <div className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap break-words border max-h-[40vh] overflow-y-auto">
                            {selectedSubmission.message}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="text-xs text-muted-foreground text-right w-full">
                        Reçu le {format(new Date(selectedSubmission.created_at), "dd MMMM yyyy 'à' HH:mm")}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {submissionToDelete && (
          <DeleteConfirmationDialog
            isOpen={!!submissionToDelete}
            onOpenChange={() => setSubmissionToDelete(null)}
            onConfirm={handleDelete}
            title="Êtes-vous sûr de vouloir supprimer ce message ?"
            description="Cette action est irréversible et supprimera définitivement le message de votre base de données."
          />
      )}
    </div>
  );
}
