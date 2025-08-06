'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  currentImageUrl?: string
  className?: string
}

export function ImageUpload({ onImageUploaded, currentImageUrl, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validaciones del lado del cliente
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.')
      return
    }

    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Tamaño máximo: 5MB.')
      return
    }

    // Mostrar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simular progreso (opcional, ya que axios no proporciona progreso real para multipart)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await apiClient.uploadImage(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success) {
        onImageUploaded(response.url)
        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      } else {
        throw new Error('Error al subir la imagen')
      }

    } catch (error: any) {
      setError(error.response?.data?.detail || error.message || 'Error al subir la imagen')
      setPreview(currentImageUrl || null)
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setError(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <Label htmlFor="image-upload">Imagen del Slide</Label>
      
      <div className="mt-2 space-y-4">
        {/* Preview de la imagen */}
        {preview && (
          <div className="relative">
            <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Área de upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={!uploading ? triggerFileSelect : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <div>
                <p className="text-sm font-medium">Haz clic para subir una imagen</p>
                <p className="text-xs text-gray-500">JPG, PNG o WebP hasta 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Mensajes de error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Botón alternativo */}
        {!preview && !uploading && (
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileSelect}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Seleccionar Imagen
          </Button>
        )}
      </div>
    </div>
  )
}
