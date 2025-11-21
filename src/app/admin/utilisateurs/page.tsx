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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAdminUser } from '@/lib/actions/users';


const formSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
});

export default function UtilisateursPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, startSubmitTransition] = useTransition();

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
          password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startSubmitTransition(async () => {
            const result = await createAdminUser(values);

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: "Erreur lors de la création",
                    description: result.error,
                });
            } else {
                toast({
                    title: 'Utilisateur créé',
                    description: `L'utilisateur ${values.email} a été ajouté avec succès.`,
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
                        Ajoutez de nouveaux utilisateurs pour leur donner accès au panneau d'administration en leur créant un compte.
                    </p>
                    <Button onClick={() => setIsFormOpen(true)} size="lg">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Ajouter un nouvel utilisateur
                    </Button>
                </CardContent>
            </Card>


             {isFormOpen && (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                            <DialogDescription>
                                Créez un compte administrateur. Vous devrez communiquer le mot de passe au nouvel utilisateur.
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
                                            <Input type="email" placeholder="nom@exemple.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Mot de passe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Création en cours...' : 'Créer l\'utilisateur'}
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
