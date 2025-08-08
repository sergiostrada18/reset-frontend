"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ArrowLeft, CheckCircle, Package } from "lucide-react"
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
import { useProducts } from "@/hooks/use-data"
import { Product } from "@/types"

const categories = [
  { value: "todos", label: "Todos los productos" },
  { value: "seguridad", label: "Seguridad" },
  { value: "climatizacion", label: "Climatización" },
  { value: "informatica", label: "Informática" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "accesorios", label: "Accesorios" },
  { value: "otros", label: "Otros" },
]

export default function ProductosPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState("todos")

  const { products, loading, error } = useProducts()

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredProducts = products?.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory
    
    let matchesPrice = true
    if (priceRange !== "todos") {
      switch (priceRange) {
        case "0-100":
          matchesPrice = product.price <= 100000
          break
        case "100-500":
          matchesPrice = product.price > 100000 && product.price <= 500000
          break
        case "500-1000":
          matchesPrice = product.price > 500000 && product.price <= 1000000
          break
        case "1000+":
          matchesPrice = product.price > 1000000
          break
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice
  }) || []

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "category":
        return a.category.localeCompare(b.category)
      case "stock":
        return b.stock - a.stock
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
      case 'accesorios': return 'default'
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
              <p className="mt-4 text-muted-foreground">Cargando productos...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
                <p className="text-gray-600">Explora toda nuestra gama de productos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los precios</SelectItem>
                <SelectItem value="0-100">Hasta $100,000</SelectItem>
                <SelectItem value="100-500">$100,000 - $500,000</SelectItem>
                <SelectItem value="500-1000">$500,000 - $1,000,000</SelectItem>
                <SelectItem value="1000+">Más de $1,000,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a menor</SelectItem>
                <SelectItem value="category">Categoría</SelectItem>
                <SelectItem value="stock">Stock disponible</SelectItem>
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-2" />
              {sortedProducts.length} productos encontrados
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron productos con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product: Product, index: number) => (
              <motion.div
                key={product.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {mounted && (
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconDisplay iconName={product.icon || "package"} size={20} />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
                          <Badge variant={getCategoryBadgeVariant(product.category)} className="mt-1 text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="space-y-3">
                      {/* Price and Stock */}
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </div>
                        <div className="flex items-center text-sm">
                          <Package className="h-3 w-3 mr-1" />
                          <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      {product.features && product.features.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                            Características:
                          </h4>
                          <ul className="space-y-1">
                            {product.features.slice(0, 2).map((feature: string, featureIndex: number) => (
                              <li key={featureIndex} className="flex items-center text-xs">
                                <CheckCircle className="h-2.5 w-2.5 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {product.features.length > 2 && (
                              <li className="text-xs text-muted-foreground">
                                +{product.features.length - 2} características más...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          className="w-full" 
                          disabled={product.stock === 0}
                          variant={product.stock === 0 ? "secondary" : "default"}
                        >
                          {product.stock === 0 ? "Sin stock" : "Solicitar Información"}
                        </Button>
                      </motion.div>
                    </div>
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
