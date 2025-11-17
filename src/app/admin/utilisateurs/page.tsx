'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Loader2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
});


export default function UtilisateursPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const supabase = createClient();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const { data: { users }, error } = await supabase.auth.admin.listUsers();
            if (error) {
                toast({
                    variant: 'destructive',
                    title: 'Erreur de chargement',
                    description: "Impossible de récupérer les utilisateurs.",
                });
            } else {
                setUsers(users);
            }
            setIsLoading(false);
        };
        fetchUsers();
    }, [supabase.auth.admin, toast]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(values.email);

        if (error) {
            toast({
                variant: 'destructive',
                title: "Erreur lors de l'invitation",
                description: error.message,
            });
        } else {
            toast({
                title: 'Invitation envoyée',
                description: `Un e-mail d'invitation a été envoyé à ${values.email}.`,
            });
            setIsFormOpen(false);
            form.reset();
            // Optionnel: rafraîchir la liste des utilisateurs
             const { data: { users: updatedUsers } } = await supabase.auth.admin.listUsers();
             if (updatedUsers) setUsers(updatedUsers);
        }
    }

    const getRoleFromMetadata = (metadata: any) => {
        return metadata?.role || 'Utilisateur';
    }

    const getBadgeVariant = (role: string) => {
        switch (role) {
            case 'Admin': return 'destructive';
            case 'Éditeur': return 'secondary';
            case 'Recruteur': return 'default';
            default: return 'outline';
        }
    }

    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                </Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Dernière connexion</TableHead>
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
                    ) : users && users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.user_metadata.full_name || user.email}</div>
                                            <div className="text-muted-foreground text-sm">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(getRoleFromMetadata(user.user_metadata))}>
                                        {getRoleFromMetadata(user.user_metadata)}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Jamais'}</TableCell>

                                <TableCell className="text-right">
                                <Button variant="ghost" size="icon" disabled>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                            Aucun utilisateur trouvé.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
             {isFormOpen && (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Inviter un nouvel utilisateur</DialogTitle>
                            <DialogDescription>
                                L'utilisateur recevra un e-mail avec un lien pour créer son compte et définir son mot de passe.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Adresse e-mail</FormLabel>
                                        <FormControl>
                                            <Input placeholder="nom@exemple.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
