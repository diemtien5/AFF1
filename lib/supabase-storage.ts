import { supabase } from "./supabase"

export const uploadImage = async (file: File, bucket = "card-images", folder = "uploads") => {
  try {
    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image")
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB")
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export const deleteImage = async (url: string, bucket = "card-images") => {
  try {
    // Extract the full file path (including nested folders) after the bucket name.
    // Supabase public URLs typically look like:
    // https://<project>.supabase.co/storage/v1/object/public/<bucket>/<folder>/file.png
    const prefix = `/storage/v1/object/public/${bucket}/`
    const pathStart = url.indexOf(prefix)
    if (pathStart === -1) {
      throw new Error("Invalid Supabase storage URL")
    }
    const filePath = url.slice(pathStart + prefix.length)

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
