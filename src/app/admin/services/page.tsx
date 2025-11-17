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
import { Textarea } from '@/components/ui/textarea';
import { iconMap } from '@/lib/icon-map';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
};

const formSchema = z.object({
  title: z.string().min(5, { message: 'Le titre doit contenir au moins 5 caractères.' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères.' }),
  icon: z.string().min(2, { message: 'Le nom de l\'icône est requis.' }),
});

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
      console.error('Error fetching services:', error.message);
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

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.reset({
        title: service.title,
        description: service.description,
        icon: service.icon
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    form.reset({
        title: '',
        description: '',
        icon: ''
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
    if (editingService) {
      const { error: updateError } = await supabase
        .from('services')
        .update(values)
        .match({ id: editingService.id });
      error = updateError;
    } else {
      const newId = generateSlug(values.title);
      const { error: insertError } = await supabase
        .from('services')
        .insert([{ ...values, id: newId }]);
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
        title: `Service ${editingService ? 'mis à jour' : 'créé'}`,
        description: `Le service a été enregistré avec succès.`,
      });
      setIsFormOpen(false);
      fetchServices();
    }
  }
  
  const handleDelete = async () => {
    if (!serviceToDelete) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .match({ id: serviceToDelete.id });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de suppression',
        description: "Le service n'a pas pu être supprimé.",
      });
    } else {
      toast({
        title: 'Service supprimé',
        description: "Le service a été supprimé avec succès.",
      });
      setServices(services.filter(service => service.id !== serviceToDelete.id));
    }
    setServiceToDelete(null);
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
              <TableHead>Titre du service</TableHead>
              <TableHead>Icône</TableHead>
              <TableHead>Description</TableHead>
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
            ) : services && services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id} onClick={() => setSelectedService(service)} className="cursor-pointer">
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell><IconComponent iconName={service.icon} /></TableCell>
                  <TableCell className="max-w-sm truncate">{service.description}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
                <TableCell colSpan={4} className="text-center h-24">
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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

      {serviceToDelete && (
        <AlertDialog open={!!serviceToDelete} onOpenChange={() => setServiceToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce service ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible.
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
