"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { jobOffersContent } from "@/lib/data";


const formSchema = z.object({
  jobPostingId: z.string({ required_error: "Veuillez sélectionner un poste." }),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().min(10, { message: "Le numéro de téléphone doit être valide." }),
  cvUrl: z.string().url({ message: "Veuillez entrer un lien valide (URL)." }),
  motivation: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
});

export default function ApplicationForm() {
  const { toast } = useToast();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offers = jobOffersContent.offers.map(offer => ({
      ...offer,
      id: offer.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
  }));


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cvUrl: "",
      motivation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        const offerData = offers.find(o => o.id === values.jobPostingId);
        
        // Ensure the job posting exists, or create it
        if (offerData) {
            await supabase.from('jobPostings').upsert({
                id: offerData.id,
                title: offerData.title,
                domain: offerData.domain,
                location: offerData.location,
            }, { onConflict: 'id' });
        }

        const { error } = await supabase.from('applications').insert({
            name: values.name,
            email: values.email,
            phone: values.phone,
            motivation: values.motivation,
            cv_url: values.cvUrl,
            status: 'Nouveau',
            job_posting_id: values.jobPostingId
        });

        if (error) throw error;

        toast({
            title: "Candidature envoyée !",
            description: "Nous avons bien reçu votre candidature et nous vous remercions.",
        });
        form.reset();
    } catch (error: any) {
        console.error("Error submitting application: ", error);
        toast({
            variant: "destructive",
            title: "Erreur lors de la soumission",
            description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="jobPostingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poste souhaité</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le poste qui vous intéresse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {offers.map((offer) => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom complet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Votre email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Votre numéro de téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="cvUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lien vers votre CV</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://www.dropbox.com/s/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message de motivation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Parlez-nous de vos motivations..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
        </Button>
      </form>
    </Form>
  );
}
