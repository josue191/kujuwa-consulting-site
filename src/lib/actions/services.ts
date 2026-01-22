'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  icon: z.string().min(2),
});

const uploadFile = async (supabase: ReturnType<typeof createClient>, file: File, bucket: string, oldUrl?: string | null) => {
  if (oldUrl) {
    const oldFileName = oldUrl.split('/').pop();
    if (oldFileName) {
      const { error } = await supabase.storage.from(bucket).remove([oldFileName]);
      if (error) console.warn(`Could not delete old file ${oldFileName}: ${error.message}`);
    }
  }
  const fileName = `${uuidv4()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
  if (uploadError) {
    throw new Error(`Erreur d'envoi du fichier (${bucket}): ${uploadError.message}`);
  }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
};

const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
};

export async function saveService(formData: FormData) {
  const supabase = createClient();
  const id = formData.get('id') as string | null;

  try {
    const values = formSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      icon: formData.get('icon'),
    });

    const imageFile = formData.get('imageFile') as File | null;
    let imageUrl = formData.get('current_image_url') as string || null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(supabase, imageFile, 'service-images', id ? imageUrl : undefined);
    }
    
    const serviceData = {
      title: values.title,
      description: values.description,
      icon: values.icon,
      image_url: imageUrl,
    };

    if (id) {
        const { error } = await supabase.from('services').update(serviceData).match({ id });
        if (error) throw error;
    } else {
        const newId = generateSlug(values.title);
        const { error } = await supabase.from('services').insert([{ ...serviceData, id: newId }]);
        if (error) throw error;
    }
      
    revalidatePath('/admin/services');
    revalidatePath('/nos-services');

    return { success: true, message: `Service ${id ? 'mis à jour' : 'créé'} avec succès.` };

  } catch (error: any) {
    console.error("Save service error:", error);
    return { success: false, message: error.message || "Une erreur est survenue." };
  }
}

export async function deleteService(service: { id: string; image_url: string | null; }) {
    const supabase = createClient();

    try {
        if (service.image_url) {
            const fileName = service.image_url.split('/').pop();
            if (fileName) {
                 await supabase.storage.from('service-images').remove([fileName]);
            }
        }

        const { error } = await supabase.from('services').delete().match({ id: service.id });
        if (error) throw error;

        revalidatePath('/admin/services');
        revalidatePath('/nos-services');

        return { success: true, message: 'Service supprimé.' };
    } catch (error: any) => {
        console.error("Delete service error:", error);
        return { success: false, message: error.message || "La suppression a échoué." };
    }
}
