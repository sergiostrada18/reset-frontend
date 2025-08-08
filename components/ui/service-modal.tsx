"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Service, ServiceCreate, ServiceUpdate } from "@/types"
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

interface ServiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service | null
  onSave: (data: ServiceCreate | ServiceUpdate) => Promise<void>
  loading?: boolean
}

const serviceCategories = [
  { value: "seguridad", label: "Seguridad" },
  { value: "climatizacion", label: "Climatización" },
  { value: "informatica", label: "Informática" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "otros", label: "Otros" },
]

export function ServiceModal({ open, onOpenChange, service, onSave, loading }: ServiceModalProps) {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<ServiceCreate & { is_active?: boolean }>({
    name: "",
    description: "",
    price: 0,
    category: "",
    icon: "monitor", // Icono por defecto
    estimated_duration: 60,
    features: [],
    is_active: true,
  })
  const [newFeature, setNewFeature] = useState("")

  const isEditing = !!service

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        icon: service.icon || "monitor",
        estimated_duration: service.estimated_duration,
        features: service.features || [],
        is_active: service.is_active,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        icon: "monitor",
        estimated_duration: 60,
        features: [],
        is_active: true,
      })
    }
  }, [service, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      return
    }

    const submitData = isEditing 
      ? formData as ServiceUpdate
      : {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          icon: formData.icon,
          estimated_duration: formData.estimated_duration,
          features: formData.features,
        } as ServiceCreate

    await onSave(submitData)
  }

  const addFeature = () => {
    if (newFeature.trim() && !(formData.features || []).includes(newFeature.trim())) {
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
            {isEditing ? "Editar Servicio" : "Crear Nuevo Servicio"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los datos del servicio."
              : "Completa los datos para crear un nuevo servicio."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Servicio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del servicio"
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
                  {serviceCategories.map((category) => (
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
              placeholder="Descripción del servicio"
              rows={3}
              required
            />
          </div>

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
              <Label htmlFor="duration">Duración Estimada (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.estimated_duration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) || 60 }))}
                placeholder="60"
              />
            </div>
          </div>

          {/* Selector de Icono */}
          <div className="space-y-2">
            <Label>Icono del Servicio</Label>
            {mounted ? (
              <IconSelector
                selectedIcon={formData.icon || "monitor"}
                onIconSelect={(iconName) => setFormData(prev => ({ ...prev, icon: iconName }))}
                category={formData.category}
                className="w-full"
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
              <Label htmlFor="is_active">Servicio activo</Label>
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
