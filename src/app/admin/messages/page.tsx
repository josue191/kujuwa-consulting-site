'use client';
import { useState } from 'react';
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

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

type MessagesPageContentProps = {
  submissions: ContactSubmission[];
  totalSubmissions: number;
  page: number;
  itemsPerPage: number;
};

function MessagesPageContent({ submissions, totalSubmissions, page, itemsPerPage }: MessagesPageContentProps) {
  const { toast } = useToast();
  const [currentSubmissions, setCurrentSubmissions] = useState(submissions);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!submissionToDelete) return;
    setIsDeleting(true);

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
      setCurrentSubmissions(currentSubmissions.filter(s => s.id !== submissionToDelete.id));
    }
    setSubmissionToDelete(null);
    setIsDeleting(false);
  };
  
  const totalPages = Math.ceil(totalSubmissions / itemsPerPage);

  const PaginationControls = () => (
     totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
                Page {page + 1} sur {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                asChild
            >
                <a href={`?page=${page -1}`}><ArrowLeft className="mr-2 h-4 w-4" /> Précédent</a>
            </Button>
            <Button
                variant="outline"
                size="sm"
                asChild
            >
                <a href={`?page=${page + 1}`}><ArrowRight className="ml-2 h-4 w-4" /> Suivant</a>
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
                {currentSubmissions.length > 0 ? (
                currentSubmissions.map((submission) => (
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
         {currentSubmissions.length > 0 ? (
            <>
            {currentSubmissions.map((submission) => (
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
            isPending={isDeleting}
          />
      )}
    </div>
  );
}


import { createClient } from '@/lib/supabase/server';

const ITEMS_PER_PAGE = 10;

export default async function MessagesPage({ searchParams }: { searchParams?: { page?: string }}) {
  const supabase = createClient();
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 0;
  
  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('contactFormSubmissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching submissions:', error);
    return <div>Erreur de chargement des messages.</div>
  }

  return <MessagesPageContent submissions={data || []} totalSubmissions={count || 0} page={page} itemsPerPage={ITEMS_PER_PAGE} />
}
