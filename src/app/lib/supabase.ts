// app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadPoster(file: File, collegeId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `public/${collegeId}-${Date.now()}.${fileExt}`

    // Add contentType for better MIME type handling
    const { error: uploadError } = await supabase.storage
      .from('college-posters')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type // Add this line
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('college-posters')
      .getPublicUrl(filePath)

    console.log("Generated Public URL:", data.publicUrl)
    console.log("Upload path used:", filePath)
    
    return data.publicUrl
  } catch (error) {
    console.error('Detailed error in upload function:', error)
    return null
  }
}

export async function uploadIDCard(file: File, uniqueId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `public/${uniqueId}-${Date.now()}.${fileExt}`

    // Add contentType for better MIME type handling
    const { error: uploadError } = await supabase.storage
      .from('spoc-id-cards')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      })

    if (uploadError) {
      console.error('Error uploading ID card:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('spoc-id-cards')
      .getPublicUrl(filePath)
    
    console.log("Generated Public URL for ID card:", data.publicUrl)
    
    return data.publicUrl
  } catch (error) {
    console.error('Detailed error in ID card upload function:', error)
    return null
  }
}

export async function uploadVerificationPhotos(files: File[], assignmentId: string): Promise<string[]> {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `public/${assignmentId}-${Date.now()}-${index}.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('verification-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error(`Error uploading photo ${index}:`, uploadError);
        return null;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('verification-photos')
        .getPublicUrl(filePath);
      
      console.log(`Generated Public URL for photo ${index}:`, data.publicUrl);
      
      return data.publicUrl;
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    
    // Filter out any failed uploads
    return results.filter(url => url !== null) as string[];
  } catch (error) {
    console.error('Detailed error in verification photos upload function:', error);
    return [];
  }
}