"use client"

import { useState, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { Product, ProductCreate, ProductUpdate } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { IconSelector } from "@/components/ui/icon-selector"
import { ImageUpload } from "@/components/ui/image-upload"

interface ProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSave: (data: ProductCreate | ProductUpdate) => Promise<void>
  loading?: boolean
}

const productCategories = [
  { value: "seguridad", label: "Seguridad" },
  { value: "climatizacion", label: "Climatización" },
  { value: "informatica", label: "Informática" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "accesorios", label: "Accesorios" },
  { value: "otros", label: "Otros" },
]

export function ProductModal({ open, onOpenChange, product, onSave, loading }: ProductModalProps) {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<ProductCreate & { is_active?: boolean; image?: string }>({
    name: "",
    description: "",
    price: 0,
    category: "",
    icon: "monitor", // Icono por defecto
    stock: 0,
    features: [],
    is_active: true,
    image: "",
  })
  const [newFeature, setNewFeature] = useState("")

  const isEditing = !!product

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        icon: product.icon || "monitor",
        stock: product.stock,
        features: product.features || [],
        is_active: product.is_active,
        image: product.image || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        icon: "monitor",
        stock: 0,
        features: [],
        is_active: true,
        image: "",
      })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      return
    }

    const submitData = isEditing 
      ? formData as ProductUpdate
      : {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          icon: formData.icon,
          image: formData.image,
          stock: formData.stock,
          features: formData.features,
        } as ProductCreate

    await onSave(submitData)
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter(feature => feature !== featureToRemove)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los datos del producto."
              : "Completa los datos para crear un nuevo producto."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción del producto"
              rows={3}
              required
            />
          </div>
          <ImageUpload
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
            currentImageUrl={formData.image}
            className="space-y-2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icono del Producto</Label>
            {mounted ? (
              <IconSelector
                selectedIcon={formData.icon || "monitor"}
                onIconSelect={(icon) => setFormData(prev => ({ ...prev, icon }))}
              />
            ) : (
              <div className="h-32 border border-border rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">Cargando selector de iconos...</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Características</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Agregar característica"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                disabled={!newFeature.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {(formData.features || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.features || []).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Producto activo</Label>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
