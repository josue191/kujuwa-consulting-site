
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
    .refine((files) => !files || files?.length === 1, "Vous ne pouvez téléverser qu'un seul fichier.")
    .refine((files) => !files || files?.[0]?.size <= 2000000, `La taille max est 2MB.`)
    .refine(
      (files) => !files || ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Formats supportés: .jpg, .png, .webp"
    ),
});

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
    },
  });
  
  const fetchTeamMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error.message);
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

  useEffect(() => {
    fetchTeamMembers();
  }, [supabase, toast]);

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.reset({
        name: member.name,
        role: member.role,
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    form.reset({
        name: '',
        role: '',
    });
    setIsFormOpen(true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let imageUrl = editingMember?.image_url || null;

    const imageFile = values.imageFile?.[0];
    if (imageFile) {
        // Supprimer l'ancienne image si elle existe et si on edite
        if (editingMember?.image_url) {
            const oldFileName = editingMember.image_url.split('/').pop();
            if (oldFileName) {
                await supabase.storage.from('team-images').remove([oldFileName]);
            }
        }

        const fileName = `${uuidv4()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('team-images')
            .upload(fileName, imageFile);

        if (uploadError) {
            toast({ variant: "destructive", title: "Erreur d'envoi de l'image", description: uploadError.message });
            return;
        }

        const { data: urlData } = supabase.storage.from('team-images').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
    } else if (!editingMember) {
        // if creating a new member without an image, it's an issue unless we allow it.
        // For now, let's assume image is not mandatory on creation but good to have
    }

    const memberData = {
        name: values.name,
        role: values.role,
        image_url: imageUrl,
    };

    let error;
    if (editingMember) {
      const { error: updateError } = await supabase
        .from('team_members')
        .update(memberData)
        .match({ id: editingMember.id });
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('team_members')
        .insert([memberData]);
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
        title: `Membre ${editingMember ? 'mis à jour' : 'ajouté'}`,
        description: `Le membre de l'équipe a été enregistré avec succès.`,
      });
      setIsFormOpen(false);
      fetchTeamMembers();
    }
  }
  
  const handleDelete = async () => {
    if (!memberToDelete) return;

    // Delete image from storage
    if (memberToDelete.image_url) {
        const fileName = memberToDelete.image_url.split('/').pop();
        if (fileName) {
            await supabase.storage.from('team-images').remove([fileName]);
        }
    }

    // Delete record from table
    const { error } = await supabase
      .from('team_members')
      .delete()
      .match({ id: memberToDelete.id });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de suppression',
        description: "Le membre n'a pas pu être supprimé.",
      });
    } else {
      toast({
        title: 'Membre supprimé',
        description: "Le membre de l'équipe a été supprimé avec succès.",
      });
      setTeamMembers(teamMembers.filter(member => member.id !== memberToDelete.id));
    }
    setMemberToDelete(null);
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
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4 py-4">
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
                        </div>
                        <DialogFooter className="pt-4">
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
