'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
});

export default function UtilisateursPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, startSubmitTransition] = useTransition();

    const supabase = createClient();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startSubmitTransition(async () => {
            const { error } = await supabase.auth.admin.inviteUserByEmail(values.email);

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
            }
        });
    }

    return (
        <div className="w-full flex justify-center items-start pt-16">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                        <Users className="h-8 w-8" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-headline">Gestion des utilisateurs</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-muted-foreground">
                        Invitez de nouveaux utilisateurs pour leur donner accès au panneau d'administration. Ils recevront un e-mail avec les instructions pour créer leur compte.
                    </p>
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg text-left text-sm">
                        <h4 className="font-bold">Information importante</h4>
                        <p>Pour que cette fonctionnalité marche, activez le modèle d'e-mail **"Invite user"** dans les paramètres d'authentification de votre projet Supabase.</p>
                    </div>
                    <Button onClick={() => setIsFormOpen(true)} size="lg">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Inviter un nouvel utilisateur
                    </Button>
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
