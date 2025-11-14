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
import { Loader2, Eye, Mail } from 'lucide-react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submissionDate: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function MessagesPage() {
  const firestore = useFirestore();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const submissionsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'contactFormSubmissions'), orderBy('submissionDate', 'desc'));
  }, [firestore]);
  
  const { data: submissions, isLoading } = useCollection<ContactSubmission>(submissionsQuery);

  return (
    <div className="w-full">
      {/* Affichage sur grand écran */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
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
            ) : submissions && submissions.length > 0 ? (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.subject}</TableCell>
                  <TableCell>
                    {submission.submissionDate
                      ? format(new Date(submission.submissionDate.seconds * 1000), 'dd/MM/yyyy HH:mm')
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(submission)}>
                      <Eye className="h-4 w-4" />
                       <span className="sr-only">Voir le message</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
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
                        <CardTitle className="text-base">{submission.subject}</CardTitle>
                        <CardDescription>De : {submission.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground truncate">{submission.message}</p>
                    </CardContent>
                    <div className="flex justify-between items-center px-6 pb-4 text-xs text-muted-foreground">
                        <span>{submission.email}</span>
                        <span>
                            {submission.submissionDate
                            ? format(new Date(submission.submissionDate.seconds * 1000), 'dd/MM/yy')
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
                    <DialogTitle>{selectedSubmission.subject}</DialogTitle>
                    <DialogDescription>
                        Message de {selectedSubmission.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary">Email</Badge>
                        <a href={`mailto:${selectedSubmission.email}`} className="text-sm text-primary hover:underline">
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
                        Reçu le {format(new Date(selectedSubmission.submissionDate.seconds * 1000), 'dd MMMM yyyy \'à\' HH:mm')}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
