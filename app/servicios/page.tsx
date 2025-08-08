"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconDisplay } from "@/components/ui/icon-selector"
import { WhatsAppButton } from "@/components/whatsapp-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useServices } from "@/hooks/use-data"
import { Service } from "@/types"

const categories = [
  { value: "todos", label: "Todos los servicios" },
  { value: "seguridad", label: "Seguridad" },
  { value: "climatizacion", label: "Climatización" },
  { value: "informatica", label: "Informática" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "otros", label: "Otros" },
]

export default function ServiciosPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [sortBy, setSortBy] = useState("name")

  const { services, loading, error } = useServices()

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredServices = services?.filter((service: Service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const sortedServices = [...filteredServices].sort((a: Service, b: Service) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price":
        return a.price - b.price
      case "category":
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'seguridad': return 'destructive'
      case 'climatizacion': return 'default'
      case 'informatica': return 'secondary'
      case 'mantenimiento': return 'outline'
      default: return 'default'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando servicios...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nuestros Servicios</h1>
                <p className="text-gray-600">Descubre todos los servicios que ofrecemos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="category">Categoría</SelectItem>
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-2" />
              {sortedServices.length} servicios encontrados
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8">
        {sortedServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron servicios con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.map((service: Service, index: number) => (
              <motion.div
                key={service.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {mounted && (
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconDisplay iconName={service.icon || "wrench"} size={24} />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <Badge variant={getCategoryBadgeVariant(service.category)} className="mt-1">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(service.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.estimated_duration} min
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Incluye:</h4>
                        <ul className="space-y-1">
                          {service.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                            <li key={featureIndex} className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {service.features.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              +{service.features.length - 3} características más...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <motion.div
                      className="mt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full">Solicitar Información</Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton 
        phoneNumber="+5219932081792" // Número real de RESET Multiservicios
        position="bottom-right"
      />
    </div>
  )
}
