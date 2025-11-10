'use client';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { initializeFirebase } from ".";

const { storage } = initializeFirebase();

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in the storage bucket where the file should be saved.
 * @returns A promise that resolves with the download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Create a unique filename to avoid overwrites
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `${path}/${uniqueFileName}`);

  try {
    // 'uploadBytes' is the recommended function for file uploads.
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL after the upload is complete.
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage: ", error);
    // Re-throw the error to be handled by the calling function
    throw new Error("File upload failed.");
  }
};
