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
import { v4 as uuidv4 } from 'uuid';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

type Project = {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string;
  image_url: string | null;
  report_url: string | null;
  created_at: string;
};

const formSchema = z.object({
  title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères.' }),
  category: z.string().min(2, { message: 'La catégorie est requise.' }),
  year: z.coerce.number().min(1900, 'Année invalide').max(new Date().getFullYear() + 1, 'Année invalide'),
  description: z.string().optional(),
  imageFile: z.any().optional(),
  reportFile: z.any().optional(),
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

  const imageFileRef = form.register("imageFile");
  const reportFileRef = form.register("reportFile");
  
  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error.message);
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
  
  const uploadFile = async (file: File, bucket: 'project-images' | 'project-reports') => {
      const fileName = `${uuidv4()}-${file.name}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let imageUrl = editingProject?.image_url || null;
      let reportUrl = editingProject?.report_url || null;

      const imageFile = values.imageFile?.[0];
      if (imageFile) {
          if (editingProject?.image_url) {
              const oldFileName = editingProject.image_url.split('/').pop();
              if (oldFileName) await supabase.storage.from('project-images').remove([oldFileName]);
          }
          imageUrl = await uploadFile(imageFile, 'project-images');
      }
      
      const reportFile = values.reportFile?.[0];
      if (reportFile) {
          if (editingProject?.report_url) {
              const oldFileName = editingProject.report_url.split('/').pop();
              if (oldFileName) await supabase.storage.from('project-reports').remove([oldFileName]);
          }
          reportUrl = await uploadFile(reportFile, 'project-reports');
      }

      const projectData = {
          title: values.title,
          category: values.category,
          year: values.year,
          description: values.description,
          image_url: imageUrl,
          report_url: reportUrl,
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
      if (projectToDelete.image_url) {
          const fileName = projectToDelete.image_url.split('/').pop();
          if (fileName) await supabase.storage.from('project-images').remove([fileName]);
      }
      if (projectToDelete.report_url) {
          const fileName = projectToDelete.report_url.split('/').pop();
          if (fileName) await supabase.storage.from('project-reports').remove([fileName]);
      }

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
                  <div className="h-[60vh] pr-2">
                    <ScrollArea className="h-full pr-4">
                      <div className="space-y-4 py-4">
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
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Description..." {...field} /></FormControl><FormMessage /></FormItem>
                          )}/>
                          <FormField control={form.control} name="imageFile" render={() => (
                              <FormItem><FormLabel>Image du projet (facultatif)</FormLabel><FormControl><Input type="file" accept="image/*" {...imageFileRef} /></FormControl><FormMessage /></FormItem>
                          )}/>
                          {editingProject?.image_url && <Image src={editingProject.image_url} alt={editingProject.title} width={80} height={80} className="rounded-md object-cover" />}
                          
                          <FormField control={form.control} name="reportFile" render={() => (
                              <FormItem><FormLabel>Rapport du projet (PDF, DOCX - facultatif)</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" {...reportFileRef} /></FormControl><FormMessage /></FormItem>
                          )}/>
                           {editingProject?.report_url && <a href={editingProject.report_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Voir le rapport actuel</a>}

                      </div>
                    </ScrollArea>
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                      <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</Button>
                  </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible et supprimera le projet ainsi que ses fichiers associés.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
