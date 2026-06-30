'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(2),
  category: z.string().optional(),
  year: z.coerce.number().optional(),
  description: z.string().optional(),
});

const uploadFile = async (supabase: ReturnType<typeof createClient>, file: File, bucket: string, oldUrl?: string | null) => {
  if (oldUrl) {
    const oldFileName = oldUrl.split('/').pop();
    if (oldFileName) {
      await supabase.storage.from(bucket).remove([oldFileName]);
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

export async function saveProject(formData: FormData) {
  const supabase = createClient();
  const id = formData.get('id') as string | null;

  try {
    const values = formSchema.parse({
      title: formData.get('title'),
      category: formData.get('category') || undefined,
      year: formData.get('year') || undefined,
      description: formData.get('description') || undefined,
    });

    const imageFile = formData.get('imageFile') as File;
    const reportFile = formData.get('reportFile') as File;
    
    let imageUrl = formData.get('current_image_url') as string || null;
    let reportUrl = formData.get('current_report_url') as string || null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(supabase, imageFile, 'project-images', id ? imageUrl : undefined);
    }
    
    if (reportFile && reportFile.size > 0) {
      reportUrl = await uploadFile(supabase, reportFile, 'project-reports', id ? reportUrl : undefined);
    }

    const projectData = {
      ...values,
      image_url: imageUrl,
      report_url: reportUrl,
    };

    // Use select() to get the ID of the inserted/updated project
    let projectId = id;
    if (id) {
      const { error } = await supabase.from('projects').update(projectData).match({ id });
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('projects').insert([projectData]).select('id').single();
      if (error) throw error;
      projectId = data.id;
    }

    if (!projectId) {
      throw new Error("Impossible d'obtenir l'identifiant du projet.");
    }

    // Handle deleted photos
    const deletedPhotoIds = formData.getAll('deletedPhotoIds') as string[];
    if (deletedPhotoIds.length > 0) {
      // Get URLs to delete from storage
      const { data: photosToDelete, error: fetchError } = await supabase
        .from('project_photos')
        .select('photo_url')
        .in('id', deletedPhotoIds);
      
      if (!fetchError && photosToDelete) {
        for (const photo of photosToDelete) {
          const fileName = photo.photo_url.split('/').pop();
          if (fileName) {
            await supabase.storage.from('project-images').remove([fileName]);
          }
        }
      }

      const { error: deleteError } = await supabase
        .from('project_photos')
        .delete()
        .in('id', deletedPhotoIds);
      if (deleteError) throw deleteError;
    }

    // Handle new photos
    const newPhotos = formData.getAll('newPhotos') as File[];
    if (newPhotos.length > 0) {
      for (const file of newPhotos) {
        if (file.size > 0) {
          const photoUrl = await uploadFile(supabase, file, 'project-images');
          const { error: insertError } = await supabase.from('project_photos').insert([
            {
              project_id: projectId,
              photo_url: photoUrl,
              caption: file.name.substring(0, file.name.lastIndexOf('.')) || 'Photo de réalisation',
            }
          ]);
          if (insertError) throw insertError;
        }
      }
    }
    
    revalidatePath('/admin/projets');
    revalidatePath('/nos-realisations');
    revalidatePath('/');

    return { success: true, message: `Projet ${id ? 'mis à jour' : 'créé'} avec succès.` };
  } catch (error: any) {
    console.error("Save project error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteProject(project: { id: string; image_url: string | null; report_url: string | null }) {
  const supabase = createClient();

  try {
    // Get all project photos first to delete from storage
    const { data: photos, error: photosError } = await supabase
      .from('project_photos')
      .select('photo_url')
      .eq('project_id', project.id);
    
    if (!photosError && photos) {
      for (const photo of photos) {
        const fileName = photo.photo_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('project-images').remove([fileName]);
        }
      }
    }

    if (project.image_url) {
      const fileName = project.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('project-images').remove([fileName]);
      }
    }

    if (project.report_url) {
      const fileName = project.report_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('project-reports').remove([fileName]);
      }
    }
    
    const { error } = await supabase.from('projects').delete().match({ id: project.id });
    
    if (error) throw error;

    revalidatePath('/admin/projets');
    revalidatePath('/nos-realisations');
    revalidatePath('/');
    
    return { success: true, message: 'Projet supprimé.' };
  } catch (error: any) {
     return { success: false, message: error.message };
  }
}
