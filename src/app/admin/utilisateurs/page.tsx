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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    const supabase = createClient();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Note: You must enable the "Invite user" email template in your Supabase project settings.
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(values.email);

        if (error) {
            toast({
                variant: 'destructive',
                title: "Erreur lors de l'invitation",
                description: `Cette action requiert des privilèges d'administrateur. Assurez-vous d'être connecté avec un compte disposant des droits nécessaires. Erreur: ${error.message}`,
            });
        } else {
            toast({
                title: 'Invitation envoyée',
                description: `Un e-mail d'invitation a été envoyé à ${values.email}.`,
            });
            setIsFormOpen(false);
            form.reset();
        }
    }


    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div>
                            <CardTitle>Gérer les accès</CardTitle>
                            <CardDescription>Invitez de nouveaux utilisateurs à rejoindre le tableau de bord.</CardDescription>
                         </div>
                         <Users className="h-8 w-8 text-muted-foreground"/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 border bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground mb-4">Seuls les administrateurs peuvent inviter de nouveaux utilisateurs.</p>
                        <Button onClick={() => setIsFormOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Inviter un nouvel utilisateur
                        </Button>
                    </div>
                </CardContent>
                 <CardContent>
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                        <h4 className="font-bold">Information importante</h4>
                        <p className="text-sm">Pour que les invitations par e-mail fonctionnent, vous devez activer le modèle d'e-mail **"Invite user"** dans les paramètres d'authentification de votre projet Supabase.</p>
                    </div>
                </CardContent>
            </Card>

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
