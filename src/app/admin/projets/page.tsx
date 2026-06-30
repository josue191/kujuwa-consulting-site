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
import { MoreHorizontal, PlusCircle, Loader2, Trash2, Edit, Download, ArrowLeft, ArrowRight, X, ImageIcon } from 'lucide-react';
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
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { saveProject, deleteProject } from '@/lib/actions/projects';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

type ProjectPhoto = {
  id: string;
  project_id: string;
  photo_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
};

type Project = {
  id: string;
  title: string;
  category: string | null;
  year: number | null;
  description: string | null;
  created_at: string;
  image_url: string | null;
  report_url: string | null;
  project_photos?: ProjectPhoto[];
};

const ITEMS_PER_PAGE = 10;

const formSchema = z.object({
  title: z.string().min(2, { message: 'Le titre doit contenir au moins 2 caractères.' }),
  category: z.string().optional(),
  year: z.coerce.number().optional(),
  description: z.string().optional(),
  imageFile: z
    .any()
    .optional()
    .refine((files) => !files || files?.length === 0 || files?.[0]?.size <= 5000000, `La taille max de l'image est 5MB.`)
    .refine(
      (files) => !files || files?.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Formats d'image supportés: .jpg, .png, .webp"
    ),
  reportFile: z
    .any()
    .optional()
    .refine((files) => !files || files?.length === 0 || files?.[0]?.size <= 10000000, `La taille max du rapport est 10MB.`)
    .refine(
      (files) => !files || files?.length === 0 || ['application/pdf'].includes(files?.[0]?.type),
      "Seuls les fichiers PDF sont acceptés pour le rapport."
    ),
});

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [triggerReload, setTriggerReload] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Multi-photo state
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

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

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('projects')
        .select('*, project_photos(*)', { count: 'exact' })
        .order('year', { ascending: false })
        .range(from, to);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement',
          description: `Impossible de charger les projets: ${error.message}`,
        });
      } else {
        setProjects(data || []);
        setTotalProjects(count || 0);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, [currentPage, triggerReload, supabase, toast]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDeletedPhotoIds([]);
    setNewPhotos([]);
    form.reset({
        title: project.title,
        category: project.category || '',
        year: project.year || new Date().getFullYear(),
        description: project.description || '',
    });
    form.setValue('imageFile', undefined);
    form.setValue('reportFile', undefined);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setDeletedPhotoIds([]);
    setNewPhotos([]);
    form.reset({
        title: '',
        category: '',
        year: new Date().getFullYear(),
        description: '',
    });
    form.setValue('imageFile', undefined);
    form.setValue('reportFile', undefined);
    setIsFormOpen(true);
  };
  
  const handleNewPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewPhotos(prev => [...prev, ...filesArray]);
    }
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExistingPhoto = (photoId: string) => {
    setDeletedPhotoIds(prev => 
      prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        const formData = new FormData();
        if (editingProject) {
            formData.append('id', editingProject.id);
            formData.append('current_image_url', editingProject.image_url || '');
            formData.append('current_report_url', editingProject.report_url || '');
        }
        formData.append('title', values.title);
        formData.append('category', values.category || '');
        formData.append('year', values.year?.toString() || '');
        formData.append('description', values.description || '');

        if (values.imageFile?.[0]) {
            formData.append('imageFile', values.imageFile[0]);
        }
        if (values.reportFile?.[0]) {
            formData.append('reportFile', values.reportFile[0]);
        }

        // Append multi-photo data
        deletedPhotoIds.forEach(id => {
            formData.append('deletedPhotoIds', id);
        });
        newPhotos.forEach(file => {
            formData.append('newPhotos', file);
        });

        const result = await saveProject(formData);

        if (result.success) {
            toast({ title: 'Succès', description: result.message });
            setTriggerReload(prev => prev + 1);
            setIsFormOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Erreur', description: result.message });
        }
    });
  }
  
  const handleDelete = async () => {
    if (!projectToDelete) return;
    startTransition(async () => {
        const result = await deleteProject(projectToDelete);
        if (result.success) {
            toast({ title: 'Succès', description: result.message });
            setTriggerReload(prev => prev + 1);
            setProjectToDelete(null);
        } else {
            toast({ variant: 'destructive', title: 'Erreur', description: result.message });
        }
    });
  };
  
  const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);

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
              <TableHead>Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Photos de réalisation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></TableCell></TableRow>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {project.image_url ? (
                      <Image src={project.image_url} alt={project.title} width={64} height={40} className="rounded-md object-cover h-10 w-16" />
                    ) : (
                      <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">?</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.year}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {project.project_photos?.length || 0} photo(s)
                    </span>
                  </TableCell>
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
              <TableRow><TableCell colSpan={6} className="text-center h-24">Aucun projet pour le moment.</TableCell></TableRow>
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
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>{editingProject ? "Modifier le projet" : "Ajouter un projet"}</DialogTitle>
                <DialogDescription>{editingProject ? "Mettez à jour les informations." : "Remplissez les informations."}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
                  <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Titre du projet</FormLabel><FormControl><Input placeholder="Titre..." {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input placeholder="Ex: Étude" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="year" render={({ field }) => (
                        <FormItem><FormLabel>Année</FormLabel><FormControl><Input type="number" placeholder="Ex: 2024" {...field} value={field.value ?? new Date().getFullYear()} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </div>
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Description..." className="min-h-[100px]" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField
                      control={form.control}
                      name="imageFile"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Image de couverture principale (JPG, PNG - 5MB max)</FormLabel>
                          <FormControl><Input type="file" accept="image/png, image/jpeg, image/webp" {...form.register("imageFile")} /></FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  {editingProject?.image_url && (
                    <div className="space-y-2">
                        <Label>Image actuelle</Label>
                        <Image src={editingProject.image_url} alt={editingProject.title} width={120} height={80} className="rounded-md object-cover" />
                    </div>
                  )}

                  {/* Multi-photo Realization Section */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-headline font-semibold text-lg text-foreground flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Photos de réalisation
                    </h3>
                    
                    {/* Existing photos management */}
                    {editingProject && editingProject.project_photos && editingProject.project_photos.length > 0 && (
                      <div className="space-y-2">
                        <Label>Photos existantes ({editingProject.project_photos.length})</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {editingProject.project_photos.map((photo) => {
                            const isDeleted = deletedPhotoIds.includes(photo.id);
                            return (
                              <div key={photo.id} className={`relative aspect-video rounded-md overflow-hidden border bg-muted group transition-all ${isDeleted ? 'opacity-40 line-through border-destructive' : ''}`}>
                                <Image src={photo.photo_url} alt={photo.caption || ''} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button 
                                    type="button" 
                                    variant={isDeleted ? "secondary" : "destructive"} 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => toggleDeleteExistingPhoto(photo.id)}
                                  >
                                    {isDeleted ? <PlusCircle className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                  </Button>
                                </div>
                                {isDeleted && (
                                  <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center text-xs font-semibold text-destructive-foreground">
                                    À supprimer
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* New photos input */}
                    <div className="space-y-2">
                      <Label>Ajouter des photos de réalisation (Plusieurs fichiers possibles)</Label>
                      <Input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp" 
                        multiple 
                        onChange={handleNewPhotosChange}
                      />
                      
                      {newPhotos.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <Label className="text-xs text-muted-foreground">Nouvelles photos sélectionnées ({newPhotos.length}) :</Label>
                          <div className="grid grid-cols-3 gap-3">
                            {newPhotos.map((file, index) => {
                              const objectUrl = URL.createObjectURL(file);
                              return (
                                <div key={index} className="relative aspect-video rounded-md overflow-hidden border bg-muted group">
                                  <img src={objectUrl} alt={file.name} className="h-full w-full object-cover" />
                                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                      type="button" 
                                      variant="destructive" 
                                      size="icon" 
                                      className="h-8 w-8 rounded-full"
                                      onClick={() => removeNewPhoto(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[10px] text-white truncate">
                                    {file.name}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                      control={form.control}
                      name="reportFile"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Rapport du projet (PDF - 10MB max)</FormLabel>
                          <FormControl><Input type="file" accept=".pdf" {...form.register("reportFile")} /></FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  {editingProject?.report_url && (
                    <div className="space-y-2">
                        <Label>Rapport actuel</Label>
                        <div className="flex items-center gap-2">
                           <Button asChild variant="outline" size="sm">
                                 <a href={editingProject.report_url} target="_blank" rel="noopener noreferrer">
                                     <Download className="mr-2 h-4 w-4" />
                                     Voir le rapport
                                 </a>
                           </Button>
                        </div>
                    </div>
                  )}
                  <DialogFooter className="pt-4 border-t sticky bottom-0 bg-background py-4">
                      <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                      <Button type="submit" disabled={isPending}>{isPending ? 'Enregistrement...' : 'Enregistrer'}</Button>
                  </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>

      {projectToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!projectToDelete}
          onOpenChange={() => setProjectToDelete(null)}
          onConfirm={handleDelete}
          title="Supprimer ce projet ?"
          description="Cette action est irréversible et supprimera le projet, son image et son rapport associés."
          isPending={isPending}
        />
       )}
    </div>
  );
}
