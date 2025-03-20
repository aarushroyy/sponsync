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