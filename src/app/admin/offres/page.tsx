
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Loader2, MapPin, Trash2, Edit, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

type JobPosting = {
  id: string;
  title: string;
  domain: string;
  location: string;
  description: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 10;

const formSchema = z.object({
  title: z.string().min(5, { message: 'Le titre doit contenir au moins 5 caractères.' }),
  domain: z.string().min(2, { message: 'Le domaine est requis.' }),
  location: z.string().min(2, { message: 'Le lieu est requis.' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères.' }),
});

export default function OffresPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobPosting | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      domain: '',
      location: '',
      description: '',
    },
  });

  const fetchJobPostings = async () => {
    setIsLoading(true);
    const from = currentPage * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from('jobPostings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching job postings:', error.message);
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: `Une erreur est survenue: ${error.message}`,
      });
    } else {
      setJobPostings(data || []);
      setTotalJobs(count || 0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobPostings();
  }, [supabase, toast, currentPage]);

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    form.reset({
        title: job.title,
        domain: job.domain,
        location: job.location,
        description: job.description || ''
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingJob(null);
    form.reset({
        title: '',
        domain: '',
        location: '',
        description: ''
    });
    setIsFormOpen(true);
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let error;
    if (editingJob) {
      // Update
      const { error: updateError } = await supabase
        .from('jobPostings')
        .update({ ...values, description: values.description })
        .match({ id: editingJob.id });
      error = updateError;
    } else {
      // Create
      const newId = generateSlug(values.title);
      const { error: insertError } = await supabase
        .from('jobPostings')
        .insert([{ ...values, id: newId, description: values.description }]);
      error = insertError;
    }

    if (error) {
      toast({
        variant: 'destructive',
        title: "Erreur lors de l'enregistrement",
        description: error.message,
      });
    } else {
      toast({
        title: `Offre ${editingJob ? 'mise à jour' : 'créée'}`,
        description: `L'offre d'emploi a été enregistrée avec succès.`,
      });
      setIsFormOpen(false);
      fetchJobPostings();
    }
  }
  
  const handleDelete = async () => {
    if (!jobToDelete) return;

    const { error } = await supabase
      .from('jobPostings')
      .delete()
      .match({ id: jobToDelete.id });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de suppression',
        description: "L'offre n'a pas pu être supprimée.",
      });
    } else {
      toast({
        title: 'Offre supprimée',
        description: "L'offre a été supprimée avec succès.",
      });
      fetchJobPostings();
    }
    setJobToDelete(null);
  };
  
  const totalPages = Math.ceil(totalJobs / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une offre
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre du poste</TableHead>
              <TableHead>Domaine</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Date de création</TableHead>
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
            ) : jobPostings && jobPostings.length > 0 ? (
              jobPostings.map((job) => (
                <TableRow key={job.id} onClick={() => setSelectedJob(job)} className="cursor-pointer">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.domain}</TableCell>
                   <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                    </TableCell>
                  <TableCell>
                    {job.created_at
                      ? format(new Date(job.created_at), 'dd/MM/yyyy')
                      : 'N/A'}
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
                        <DropdownMenuItem onSelect={() => handleEdit(job)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                         <DropdownMenuItem
                          className="text-red-500"
                          onSelect={() => setJobToDelete(job)}
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
                <TableCell colSpan={5} className="text-center h-24">
                  Aucune offre d'emploi pour le moment.
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
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
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


       {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="break-words">{selectedJob.title}</DialogTitle>
                    <DialogDescription>
                        {selectedJob.domain} - {selectedJob.location}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Description du poste</h4>
                        <div className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap break-words border max-h-[40vh] overflow-y-auto">
                            {selectedJob.description}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="text-xs text-muted-foreground text-right w-full">
                        Créée le {format(new Date(selectedJob.created_at), "dd MMMM yyyy 'à' HH:mm")}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

       {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="break-words">{editingJob ? "Modifier l'offre" : "Créer une nouvelle offre"}</DialogTitle>
                    <DialogDescription>
                        {editingJob ? "Mettez à jour les détails de l'offre." : "Remplissez les informations ci-dessous."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Titre du poste</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Développeur Web" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="domain"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Domaine</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Informatique" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Lieu</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Kinshasa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description détaillée du poste..." className="min-h-[120px]" {...field}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      )}

      {jobToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!jobToDelete}
          onOpenChange={() => setJobToDelete(null)}
          onConfirm={handleDelete}
          title="Êtes-vous sûr de vouloir supprimer cette offre ?"
          description="Cette action est irréversible. Elle supprimera définitivement l'offre d'emploi."
        />
      )}
    </div>
  );
}
