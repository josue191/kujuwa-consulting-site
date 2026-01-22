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
import { iconMap } from '@/lib/icon-map';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { saveService, deleteService } from '@/lib/actions/services';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
  image_url: string | null;
};

const formSchema = z.object({
  title: z.string().min(5, { message: 'Le titre doit contenir au moins 5 caractères.' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères.' }),
  icon: z.string().min(2, { message: 'Le nom de l\'icône est requis.' }),
  imageFile: z
    .any()
    .optional()
    .refine((files) => !files || files?.length === 0 || files?.length === 1, "Vous ne pouvez téléverser qu'un seul fichier.")
    .refine((files) => !files || files?.length === 0 || files?.[0]?.size <= 5000000, `La taille max est 5MB.`)
    .refine(
      (files) => !files || files?.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Formats supportés: .jpg, .png, .webp"
    ),
});

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
    },
  });
  
  const fetchServices = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: `Une erreur est survenue: ${error.message}`,
      });
    } else {
      setServices(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, [supabase, toast]);

  useEffect(() => {
    const channel = supabase
      .channel('services_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' },
        (payload) => {
           fetchServices();
        }
      ).subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.reset({
        title: service.title,
        description: service.description,
        icon: service.icon
    });
    form.setValue('imageFile', undefined);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    form.reset({
        title: '',
        description: '',
        icon: ''
    });
    form.setValue('imageFile', undefined);
    setIsFormOpen(true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        const formData = new FormData();
        if (editingService) {
            formData.append('id', editingService.id);
            formData.append('current_image_url', editingService.image_url || '');
        }
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('icon', values.icon);

        if (values.imageFile?.[0]) {
            formData.append('imageFile', values.imageFile[0]);
        }

        const result = await saveService(formData);

        if (result.success) {
            toast({ title: 'Succès', description: result.message });
            setIsFormOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Erreur', description: result.message });
        }
    });
  }
  
  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    startTransition(async () => {
        const result = await deleteService(serviceToDelete);
        if (result.success) {
            toast({ title: 'Succès', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Erreur', description: result.message });
        }
        setServiceToDelete(null);
    });
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || MoreHorizontal;
    return <Icon className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Titre du service</TableHead>
              <TableHead>Icône</TableHead>
              <TableHead>Description</TableHead>
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
            ) : services && services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    {service.image_url ? (
                      <Image src={service.image_url} alt={service.title} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                    ) : (
                      <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">Pas d'image</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell><IconComponent iconName={service.icon} /></TableCell>
                  <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEdit(service)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                         <DropdownMenuItem
                          className="text-red-500"
                          onSelect={() => setServiceToDelete(service)}
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
                  Aucun service pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="break-words">{editingService ? "Modifier le service" : "Créer un nouveau service"}</DialogTitle>
                    <DialogDescription>
                        {editingService ? "Mettez à jour les détails du service." : "Remplissez les informations ci-dessous."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ScrollArea className="h-[60vh] pr-6">
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Titre du service</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Consultance et Mentorat" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Nom de l'icône (Lucide React)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: BrainCircuit" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description détaillée du service..." className="min-h-[120px]" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="imageFile"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Image du service (JPG, PNG - 5MB max)</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/png, image/jpeg, image/webp" {...form.register("imageFile")} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {editingService?.image_url && (
                                <div className="space-y-2">
                                    <Label>Image actuelle</Label>
                                    <Image src={editingService.image_url} alt={editingService.title} width={100} height={100} className="rounded-md object-cover" />
                                </div>
                                )}
                            </div>
                        </ScrollArea>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      )}

      {serviceToDelete && (
          <DeleteConfirmationDialog
            isOpen={!!serviceToDelete}
            onOpenChange={() => setServiceToDelete(null)}
            onConfirm={handleDelete}
            title="Êtes-vous sûr de vouloir supprimer ce service ?"
            description="Cette action est irréversible. Elle supprimera définitivement le service et son image associée."
            isPending={isPending}
          />
      )}
    </div>
  );
}
