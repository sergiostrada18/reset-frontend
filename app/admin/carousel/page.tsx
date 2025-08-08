"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCarouselSlides, useCarouselManagement } from "@/hooks/use-data"
import { CarouselSlideCreate, CarouselSlideUpdate, CarouselSlide } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Plus, 
  Loader
} from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import SlidesList from "@/components/slides-list"

interface CarouselFormData {
  title: string
  description: string
  image_url: string
  button_text?: string
  button_link?: string
  show_button: boolean
  is_active: boolean
}

const initialFormData: CarouselFormData = {
  title: "",
  description: "",
  image_url: "",
  button_text: "",
  button_link: "",
  show_button: false,
  is_active: true
}

export default function CarouselManagement() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { slides, loading, error, refetch } = useCarouselSlides()
  const { 
    createSlide, 
    updateSlide, 
    deleteSlide, 
    reorderSlides,
    loading: managementLoading
  } = useCarouselManagement()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<string | null>(null)
  const [formData, setFormData] = useState<CarouselFormData>(initialFormData)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Authentication check
  useEffect(() => {
    if (mounted) {
      const isAuthenticated = localStorage.getItem('admin_token')
      if (!isAuthenticated) {
        router.push('/login')
      }
    }
  }, [router, mounted])

  // Evitar renderizado hasta que esté montado y los datos estén cargados
  if (!mounted || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  const handleCreateSlide = async () => {
    try {
      const slideData: CarouselSlideCreate = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        button_text: formData.button_text,
        button_link: formData.button_link,
        show_button: formData.show_button,
        is_active: formData.is_active
      }
      
      await createSlide(slideData)
      setFormData(initialFormData)
      setIsDialogOpen(false)
      refetch()
    } catch (error) {
      console.error('Error creating slide:', error)
    }
  }

  const handleUpdateSlide = async () => {
    if (!editingSlide) return
    
    try {
      const slideData: CarouselSlideUpdate = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        button_text: formData.button_text,
        button_link: formData.button_link,
        show_button: formData.show_button,
        is_active: formData.is_active
      }
      
      await updateSlide(editingSlide, slideData)
      setFormData(initialFormData)
      setEditingSlide(null)
      setIsDialogOpen(false)
      refetch()
    } catch (error) {
      console.error('Error updating slide:', error)
    }
  }

  const handleDeleteSlide = async (slideId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este slide?")) return
    
    try {
      await deleteSlide(slideId)
      refetch()
    } catch (error) {
      console.error('Error deleting slide:', error)
    }
  }

  const handleToggleActive = async (slideId: string, currentStatus: boolean) => {
    try {
      await updateSlide(slideId, { is_active: !currentStatus })
      refetch()
    } catch (error) {
      console.error('Error toggling slide status:', error)
    }
  }

  const handleReorder = async (slideId: string, direction: "up" | "down") => {
    if (!slides) return
    
    const currentIndex = slides.findIndex((s: CarouselSlide) => s.id === slideId)
    if (currentIndex === -1) return
    
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= slides.length) return
    
    const reorderedSlides = [...slides]
    const [movedSlide] = reorderedSlides.splice(currentIndex, 1)
    reorderedSlides.splice(newIndex, 0, movedSlide)
    
    try {
      await reorderSlides(reorderedSlides.map((s: CarouselSlide, order: number) => ({ 
        id: s.id, 
        order: order + 1 
      })))
      refetch()
    } catch (error) {
      console.error('Error reordering slides:', error)
    }
  }

  const openCreateDialog = () => {
    setFormData(initialFormData)
    setEditingSlide(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (slide: CarouselSlide) => {
    setFormData({
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url,
      button_text: slide.button_text || "",
      button_link: slide.button_link || "",
      show_button: slide.show_button || false,
      is_active: slide.is_active
    })
    setEditingSlide(slide.id)
    setIsDialogOpen(true)
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">
          Error al cargar los slides: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Carousel</h1>
                <p className="text-gray-600 mt-2">Administra los slides del carousel de la página principal</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? "Editar Slide" : "Crear Nuevo Slide"}
              </DialogTitle>
              <DialogDescription>
                {editingSlide 
                  ? "Modifica los datos del slide existente."
                  : "Completa los datos para crear un nuevo slide."
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del slide"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del slide"
                />
              </div>
              
              <ImageUpload
                onImageUploaded={(imageUrl) => setFormData(prev => ({ ...prev, image_url: imageUrl }))}
                currentImageUrl={formData.image_url}
                className="space-y-2"
              />
              
              <div>
                <Label htmlFor="buttonText">Texto del Botón (Opcional)</Label>
                <Input
                  id="buttonText"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Texto del botón de acción"
                  disabled={!formData.show_button}
                />
              </div>
              
              <div>
                <Label htmlFor="buttonLink">Enlace del Botón (Opcional)</Label>
                <Input
                  id="buttonLink"
                  value={formData.button_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                  placeholder="/ruta o https://ejemplo.com"
                  disabled={!formData.show_button}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show_button"
                  checked={formData.show_button}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_button: checked }))}
                />
                <Label htmlFor="show_button">Mostrar botón de acción</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="isActive">Slide activo</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={editingSlide ? handleUpdateSlide : handleCreateSlide}
                disabled={managementLoading}
              >
                {managementLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                {editingSlide ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    </div>

      <SlidesList
        slides={slides || []}
        onEdit={openEditDialog}
        onDelete={handleDeleteSlide}
        onToggleActive={handleToggleActive}
        onReorder={handleReorder}
        onCreateNew={openCreateDialog}
        managementLoading={managementLoading}
      />
    </div>
  )
}
