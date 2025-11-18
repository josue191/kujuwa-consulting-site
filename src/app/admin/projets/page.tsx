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
import { MoreHorizontal, PlusCircle, Loader2, Trash2, Edit } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

type Project = {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string;
  created_at: string;
};

// Simplified schema without file uploads
const formSchema = z.object({
  title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères.' }),
  category: z.string().min(2, { message: 'La catégorie est requise.' }),
  year: z.coerce.number().min(1900, 'Année invalide').max(new Date().getFullYear() + 1, 'Année invalide'),
  description: z.string().optional(),
});

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const supabase = createClient();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      year: new Date().getFullYear(),
      description: '',
    },
  });
  
  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: `Impossible de charger les projets: ${error.message}`,
      });
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
        title: project.title,
        category: project.category || '',
        year: project.year || new Date().getFullYear(),
        description: project.description || '',
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    form.reset({
        title: '',
        category: '',
        year: new Date().getFullYear(),
        description: '',
    });
    setIsFormOpen(true);
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const projectData = {
          title: values.title,
          category: values.category,
          year: values.year,
          description: values.description,
      };

      let error;
      if (editingProject) {
        const { error: updateError } = await supabase.from('projects').update(projectData).match({ id: editingProject.id });
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('projects').insert([projectData]);
        error = insertError;
      }

      if (error) throw error;

      toast({ title: `Projet ${editingProject ? 'mis à jour' : 'ajouté'}`, description: `Le projet a été enregistré.` });
      setIsFormOpen(false);
      fetchProjects();

    } catch (error: any) {
        console.error("Submit error:", error);
        toast({ variant: 'destructive', title: "Erreur lors de l'enregistrement", description: error.message });
    }
  }
  
  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      const { error } = await supabase.from('projects').delete().match({ id: projectToDelete.id });
      if (error) throw error;
      
      toast({ title: 'Projet supprimé', description: "Le projet a été supprimé." });
      setProjects(projects.filter(p => p.id !== projectToDelete.id));

    } catch (error: any) {
       toast({ variant: 'destructive', title: 'Erreur de suppression', description: error.message });
    } finally {
        setProjectToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un projet
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Année</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></TableCell></TableRow>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.year}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEdit(project)}><Edit className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => setProjectToDelete(project)}><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center h-24">Aucun projet pour le moment.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>{editingProject ? "Modifier le projet" : "Ajouter un projet"}</DialogTitle>
                <DialogDescription>{editingProject ? "Mettez à jour les informations." : "Remplissez les informations."}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <ScrollArea className="h-[60vh]">
                      <div className="space-y-4 py-4 pr-6">
                          <FormField control={form.control} name="title" render={({ field }) => (
                              <FormItem><FormLabel>Titre du projet</FormLabel><FormControl><Input placeholder="Titre..." {...field} /></FormControl><FormMessage /></FormItem>
                          )}/>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input placeholder="Ex: Étude" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="year" render={({ field }) => (
                                <FormItem><FormLabel>Année</FormLabel><FormControl><Input type="number" placeholder="Ex: 2024" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                          </div>
                          <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Description..." className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                          )}/>
                      </div>
                    </ScrollArea>
                  <DialogFooter className="mt-4 pt-4 border-t">
                      <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                      <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</Button>
                  </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible et supprimera le projet.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
