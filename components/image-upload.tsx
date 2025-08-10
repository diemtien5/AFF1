"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  label: string
  bucket?: string
  folder?: string
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  label,
  bucket = "card-images",
  folder = "uploads",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImage || "")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn file hình ảnh",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "File không được vượt quá 5MB",
          variant: "destructive",
        })
        return
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop() || 'jpg'
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        throw error
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName)

      setPreviewUrl(publicUrl)
      onImageChange(publicUrl)

      toast({
        title: "Thành công",
        description: "Đã tải ảnh lên thành công",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải ảnh lên. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl("")
    onImageChange("")
  }

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url)
    onImageChange(url)
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>

      {/* Preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="relative overflow-hidden bg-transparent"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Đang tải...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Tải ảnh lên
              </>
            )}
          </Button>

          {!previewUrl && (
            <div className="flex items-center text-gray-400">
              <ImageIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">Chưa có ảnh</span>
            </div>
          )}
        </div>

        {/* Manual URL Input */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Hoặc nhập URL ảnh:</Label>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={previewUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  )
}
