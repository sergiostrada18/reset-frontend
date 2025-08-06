"use client"

import { CarouselSlide } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus
} from "lucide-react"

interface SlidesListProps {
  slides: CarouselSlide[]
  onEdit: (slide: CarouselSlide) => void
  onDelete: (slideId: string) => void
  onToggleActive: (slideId: string, currentStatus: boolean) => void
  onReorder: (slideId: string, direction: "up" | "down") => void
  onCreateNew: () => void
  managementLoading: boolean
}

export default function SlidesList({
  slides,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
  onCreateNew,
  managementLoading
}: SlidesListProps) {
  return (
    <div className="grid gap-4">
      {slides?.length ? (
        slides.map((slide: CarouselSlide, index: number) => (
          <Card key={slide.id} className="overflow-hidden">
            <div className="flex">
              <div className="w-32 h-24 relative bg-gray-100 flex-shrink-0">
                {slide.image_url && (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{slide.title}</h3>
                      <Badge variant={slide.is_active ? "default" : "secondary"}>
                        {slide.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{slide.description}</p>
                    {slide.button_text && slide.show_button && (
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {slide.button_text}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReorder(slide.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReorder(slide.id, "down")}
                      disabled={index === slides.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActive(slide.id, slide.is_active)}
                    >
                      {slide.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(slide)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(slide.id)}
                      disabled={managementLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No hay slides creados aún</p>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer slide
          </Button>
        </Card>
      )}
    </div>
  )
}
