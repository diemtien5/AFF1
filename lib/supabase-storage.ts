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

    // Create secure unique filename using crypto.randomUUID()
    const fileExt = file.name.split(".").pop()
    const secureId = crypto.randomUUID()
    const fileName = `${folder}/${Date.now()}-${secureId}.${fileExt}`

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
    // Extract filename from URL
    const urlParts = url.split("/")
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) throw error
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
