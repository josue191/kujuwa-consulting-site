'use client';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAdminUser } from '@/lib/actions/users';

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
});

export default function UtilisateursPage() {
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
                    description: `Le compte pour ${values.email} a été créé avec succès.`,
                });
                form.reset();
            }
        });
    }

    return (
        <div className="w-full flex justify-center pt-8">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Créer un nouvel utilisateur</CardTitle>
                    <CardDescription>
                        Remplissez le formulaire pour ajouter un nouvel administrateur. Vous devrez lui communiquer son mot de passe.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Création en cours...' : 'Créer le compte'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
