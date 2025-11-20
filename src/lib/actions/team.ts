'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
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

export async function saveTeamMember(formData: FormData) {
  const supabase = createClient();
  const id = formData.get('id') as string | null;

  try {
    const values = formSchema.parse({
      name: formData.get('name'),
      role: formData.get('role'),
    });

    const imageFile = formData.get('imageFile') as File | null;
    let imageUrl = formData.get('current_image_url') as string || null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(supabase, imageFile, 'team-images', id ? imageUrl : undefined);
    }
    
    const memberData = {
      name: values.name,
      role: values.role,
      image_url: imageUrl,
    };

    const { error } = id
      ? await supabase.from('team_members').update(memberData).match({ id })
      : await supabase.from('team_members').insert([memberData]);
      
    if (error) throw error;
    
    revalidatePath('/admin/equipe');
    revalidatePath('/qui-sommes-nous');

    return { success: true, message: `Membre ${id ? 'mis à jour' : 'ajouté'} avec succès.` };

  } catch (error: any) {
    console.error("Save team member error:", error);
    return { success: false, message: error.message || "Une erreur est survenue." };
  }
}

export async function deleteTeamMember(member: { id: string; image_url: string | null; }) {
    const supabase = createClient();

    try {
        if (member.image_url) {
            const fileName = member.image_url.split('/').pop();
            if (fileName) {
                 await supabase.storage.from('team-images').remove([fileName]);
            }
        }

        const { error } = await supabase.from('team_members').delete().match({ id: member.id });
        if (error) throw error;

        revalidatePath('/admin/equipe');
        revalidatePath('/qui-sommes-nous');

        return { success: true, message: 'Membre supprimé.' };
    } catch (error: any) {
        console.error("Delete team member error:", error);
        return { success: false, message: error.message || "La suppression a échoué." };
    }
}
