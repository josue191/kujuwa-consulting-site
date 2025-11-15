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
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function MessagesPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contactFormSubmissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setSubmissions(data as ContactSubmission[]);
      }
      setIsLoading(false);
    };
    fetchSubmissions();
  }, [supabase]);

  const handleDelete = async () => {
    if (!submissionToDelete) return;
    
    const { error } = await supabase.from('contactFormSubmissions').delete().match({ id: submissionToDelete.id });
    
    if (error) {
        toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'La suppression du message a échoué.',
        });
        console.error("Error deleting submission:", error);
    } else {
        toast({
            title: 'Message supprimé',
            description: 'Le message a été supprimé avec succès.',
        });
        setSubmissions(submissions.filter(s => s.id !== submissionToDelete.id));
    }
    setSubmissionToDelete(null);
  };


  return (
    <div className="w-full">
      {/* Affichage sur grand écran */}
      <div className="hidden md:block border rounded-lg">
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

      {/* Affichage sur petit écran (mobile) */}
      <div className="md:hidden space-y-4">
         {isLoading ? (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
         ) : submissions && submissions.length > 0 ? (
            submissions.map((submission) => (
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
            ))
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
        <AlertDialog open={!!submissionToDelete} onOpenChange={() => setSubmissionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce message ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible et supprimera définitivement le message de la base de données.
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
