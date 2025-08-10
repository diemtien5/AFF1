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
    const fileExt = file.name.split(".").pop() || 'jpg'
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
    // Extract the full path from the public URL
    const urlObj = new URL(url)
    const pathSegments = urlObj.pathname.split('/')
    
    // Find the storage bucket segment and extract everything after it
    const bucketIndex = pathSegments.findIndex(segment => segment === bucket)
    if (bucketIndex === -1 || bucketIndex === pathSegments.length - 1) {
      throw new Error("Invalid storage URL format")
    }
    
    // Get the full file path including folders
    const filePath = pathSegments.slice(bucketIndex + 1).join('/')
    
    if (!filePath) {
      throw new Error("Could not extract file path from URL")
    }

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
