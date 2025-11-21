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
import { MoreHorizontal, PlusCircle, Loader2, Trash2, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
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

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
});

export default function UtilisateursPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, startSubmitTransition] = useTransition();

    const supabase = createClient();
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            // Note: This requires admin privileges.
            // Ensure you are calling this from a secure context or have appropriate RLS.
            // For a client-side admin dashboard, it's often better to do this via a server-side function.
            // However, Supabase client handles auth context. If logged in user has admin rights, this can work.
            const { data: { users }, error } = await supabase.auth.admin.listUsers();
            
            if (error) {
                console.error("Error fetching users:", error);
                toast({
                    variant: "destructive",
                    title: "Erreur de chargement",
                    description: `Impossible de lister les utilisateurs. Assurez-vous d'avoir les droits d'administrateur. ${error.message}`
                });
            } else {
                setUsers(users);
            }
            setIsLoading(false);
        };
        fetchUsers();
    }, [supabase, toast]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startSubmitTransition(async () => {
            // Note: You must enable the "Invite user" email template in your Supabase project settings.
            const { data, error } = await supabase.auth.admin.inviteUserByEmail(values.email);

            if (error) {
                toast({
                    variant: 'destructive',
                    title: "Erreur lors de l'invitation",
                    description: `Cette action requiert des privilèges d'administrateur. ${error.message}`,
                });
            } else {
                toast({
                    title: 'Invitation envoyée',
                    description: `Un e-mail d'invitation a été envoyé à ${values.email}.`,
                });
                setIsFormOpen(false);
                form.reset();
                 // Refresh users list
                 const { data: { users: updatedUsers } } = await supabase.auth.admin.listUsers();
                 if (updatedUsers) setUsers(updatedUsers);
            }
        });
    }
    
    const getInitials = (email: string = '') => {
        return email.substring(0, 2).toUpperCase();
    }


    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Inviter un utilisateur
                </Button>
            </div>
             <div className="p-4 mb-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                <h4 className="font-bold">Information importante</h4>
                <p className="text-sm">Pour que les invitations par e-mail fonctionnent, vous devez activer le modèle d'e-mail **"Invite user"** dans les paramètres d'authentification de votre projet Supabase.</p>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Dernière connexion</TableHead>
                            <TableHead>Date d'inscription</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : users && users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.user_metadata.avatar_url} />
                                                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.user_metadata.full_name || user.email?.split('@')[0]}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.last_sign_in_at 
                                        ? formatDistanceToNow(new Date(user.last_sign_in_at), { addSuffix: true, locale: fr })
                                        : 'Jamais'}
                                    </TableCell>
                                    <TableCell>
                                         {user.created_at
                                        ? format(new Date(user.created_at), 'dd/MM/yyyy')
                                        : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
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
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
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
