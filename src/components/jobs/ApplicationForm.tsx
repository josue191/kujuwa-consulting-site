"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

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
import { jobOffersContent } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";


const formSchema = z.object({
  jobPostingId: z.string({ required_error: "Veuillez sélectionner un poste." }),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().min(10, { message: "Le numéro de téléphone doit être valide." }),
  cvFile: z
    .any()
    .refine((files) => files?.length === 1, "Un fichier CV est requis.")
    .refine((files) => files?.[0]?.size <= 5000000, `La taille max est 5MB.`)
    .refine(
      (files) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(files?.[0]?.type),
      "Formats supportés: .pdf, .doc, .docx"
    ),
  motivation: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
});

export default function ApplicationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

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
      motivation: "",
    },
  });
  
  const cvFileRef = form.register("cvFile");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const cvFile = values.cvFile[0];
    if (!cvFile) {
        toast({ variant: "destructive", title: "Erreur", description: "Fichier CV manquant." });
        setIsSubmitting(false);
        return;
    }

    const fileName = `${uuidv4()}-${cvFile.name}`;
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(fileName, cvFile);

    if (uploadError) {
        toast({ variant: "destructive", title: "Erreur de téléversement", description: uploadError.message });
        setIsSubmitting(false);
        return;
    }
    
    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(fileName);
    const cvUrl = urlData.publicUrl;


    const applicationData = {
        job_posting_id: values.jobPostingId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        cv_url: cvUrl,
        motivation: values.motivation
    };

    const { error: insertError } = await supabase.from('applications').insert([applicationData]);

    if (insertError) {
        toast({
            variant: "destructive",
            title: "Erreur lors de l'envoi",
            description: "Une erreur est survenue. Veuillez réessayer.",
        });
    } else {
        toast({
            title: "Candidature envoyée !",
            description: "Nous avons bien reçu votre candidature et nous vous remercions.",
        });
        form.reset();
    }
    setIsSubmitting(false);
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
          name="cvFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre CV (PDF, DOC, DOCX - 5MB max)</FormLabel>
              <FormControl>
                <Input 
                  type="file"
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  {...cvFileRef}
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
