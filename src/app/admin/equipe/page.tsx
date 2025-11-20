
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
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { saveTeamMember, deleteTeamMember } from '@/lib/actions/team';


type TeamMember = {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  created_at: string;
};

const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  role: z.string().min(2, { message: 'Le rôle doit contenir au moins 2 caractères.' }),
  imageFile: z
    .any()
    .optional()
    .refine((files) => !files || files?.length === 0 || files?.length === 1, "Vous ne pouvez téléverser qu'un seul fichier.")
    .refine((files) => !files || files?.length === 0 || files?.[0]?.size <= 2000000, `La taille max est 2MB.`)
    .refine(
      (files) => !files || files?.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Formats supportés: .jpg, .png, .webp"
    ),
});

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
    },
  });
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Erreur de chargement',
                description: `Une erreur est survenue: ${error.message}`,
            });
        } else {
            setTeamMembers(data || []);
        }
        setIsLoading(false);
    };
    fetchTeamMembers();
  }, [supabase, toast]);

  useEffect(() => {
    const channel = supabase
      .channel('team_members_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' },
        (payload) => {
           // Re-fetch data on any change
           const fetchTeamMembers = async () => {
                const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('created_at', { ascending: true });

                if (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Erreur de synchronisation',
                        description: `Impossible de rafraîchir les données: ${error.message}`,
                    });
                } else {
                    setTeamMembers(data || []);
                }
            };
            fetchTeamMembers();
        }
      ).subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, toast]);


  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.reset({
        name: member.name,
        role: member.role,
    });
    form.setValue('imageFile', undefined);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    form.reset({
        name: '',
        role: '',
    });
     form.setValue('imageFile', undefined);
    setIsFormOpen(true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        const formData = new FormData();
        if (editingMember) {
            formData.append('id', editingMember.id);
            formData.append('current_image_url', editingMember.image_url || '');
        }
        formData.append('name', values.name);
        formData.append('role', values.role);

        if (values.imageFile?.[0]) {
            formData.append('imageFile', values.imageFile[0]);
        }

        const result = await saveTeamMember(formData);

        if (result.success) {
            toast({ title: 'Succès', description: result.message });
            setIsFormOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Erreur', description: result.message });
        }
    });
  }
  
  const handleDelete = async () => {
    if (!memberToDelete) return;
    startTransition(async () => {
      const result = await deleteTeamMember(memberToDelete);
      if (result.success) {
        toast({ title: 'Succès', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Erreur', description: result.message });
      }
      setMemberToDelete(null);
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
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
            ) : teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.image_url ? (
                      <Image src={member.image_url} alt={member.name} width={40} height={40} className="rounded-full object-cover h-10 w-10" />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">?</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEdit(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                         <DropdownMenuItem
                          className="text-red-500"
                          onSelect={() => setMemberToDelete(member)}
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
                  Aucun membre d'équipe pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingMember ? "Modifier le membre" : "Ajouter un membre"}</DialogTitle>
                    <DialogDescription>
                        {editingMember ? "Mettez à jour les informations." : "Remplissez les informations ci-dessous."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nom complet</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Jane Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Rôle / Poste</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Directrice Générale" {...field} />
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
                                <FormLabel>Photo (JPG, PNG, WebP - 2MB max)</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/png, image/jpeg, image/webp" {...form.register("imageFile")} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {editingMember?.image_url && (
                        <div className="space-y-2">
                            <Label>Photo actuelle</Label>
                            <Image src={editingMember.image_url} alt={editingMember.name} width={80} height={80} className="rounded-md object-cover" />
                        </div>
                        )}
                        <DialogFooter>
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

      {memberToDelete && (
        <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce membre ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible et supprimera sa photo et ses informations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                 {isPending ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
