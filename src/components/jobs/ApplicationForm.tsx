"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
import { useFirestore } from "@/firebase";
import { jobOffersContent } from "@/lib/data";
import { uploadFile } from "@/firebase/storage";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const formSchema = z.object({
  jobPostingId: z.string({ required_error: "Veuillez sélectionner un poste." }),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().min(10, { message: "Le numéro de téléphone doit être valide." }),
  cv: z.any()
    .refine((files) => files?.length == 1, "Le CV est requis.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `La taille max. est 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf, .doc, .docx seulement."
    ),
  motivation: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
});

export default function ApplicationForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offers = jobOffersContent.offers.map(offer => ({
      ...offer,
      // Create a simple ID from the title
      id: offer.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        if (!firestore) throw new Error("Firestore not initialized");

        const cvFile = values.cv[0];
        const cvUrl = await uploadFile(cvFile, `cvs/${values.jobPostingId}`);

        const applicationsCollection = collection(firestore, `jobPostings/${values.jobPostingId}/applications`);
        await addDoc(applicationsCollection, {
            name: values.name,
            email: values.email,
            phone: values.phone,
            motivation: values.motivation,
            cvUrl: cvUrl,
            submittedAt: serverTimestamp(),
            status: 'Nouveau'
        });

        toast({
            title: "Candidature envoyée !",
            description: "Nous avons bien reçu votre candidature et nous vous remercions.",
        });
        form.reset();
    } catch (error) {
        console.error("Error submitting application: ", error);
        toast({
            variant: "destructive",
            title: "Erreur lors de la soumission",
            description: "Une erreur est survenue. Assurez-vous que Storage est activé dans votre console Firebase et réessayez.",
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
          name="cv"
          render={({ field: { onChange, value, ...props } }) => (
            <FormItem>
              <FormLabel>Votre CV</FormLabel>
              <FormControl>
                <Input 
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => onChange(e.target.files)}
                  {...props}
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
