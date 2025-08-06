"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatCard } from "@/components/ui/stat-card"
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell } from "@/components/ui/data-table"
import { SearchBar } from "@/components/ui/search-bar"
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states"
import { AnimatedBadge, StatusBadge } from "@/components/ui/animated-badge"
import { useProducts } from "@/hooks/use-data"

export default function ProductsManagement() {
  const { products, loading, error } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products || [])

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])

  const handleDelete = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        // Aquí iría la llamada a la API para eliminar el producto
        console.log('Eliminar producto:', productId)
        // await apiClient.deleteProduct(productId)
        // Recargar la lista de productos
      } catch (error) {
        console.error('Error al eliminar producto:', error)
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <AnimatedBadge variant="danger" pulse>Sin stock</AnimatedBadge>
    if (stock < 5) return <AnimatedBadge variant="warning">Stock bajo</AnimatedBadge>
    return <AnimatedBadge variant="success">En stock</AnimatedBadge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-gray-600">Administra el catálogo de productos</p>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search and filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Productos</CardTitle>
                <CardDescription>
                  {loading ? 'Cargando...' : `${filteredProducts.length} productos encontrados`}
                </CardDescription>
              </div>
              <SearchBar
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={setSearchTerm}
                onFilterClick={() => console.log('Abrir filtros')}
                className="w-80"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingState message="Cargando productos..." />
            ) : error ? (
              <ErrorState 
                title="Error al cargar productos"
                message={error}
                action={
                  <Button onClick={() => window.location.reload()}>
                    Reintentar
                  </Button>
                }
              />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No se encontraron productos"
                description="Comienza agregando tu primer producto al catálogo"
                action={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primer producto
                  </Button>
                }
              />
            ) : (
              <DataTable>
                <DataTableHeader>
                  <DataTableRow>
                    <DataTableHead>Producto</DataTableHead>
                    <DataTableHead>Categoría</DataTableHead>
                    <DataTableHead>Precio</DataTableHead>
                    <DataTableHead>Stock</DataTableHead>
                    <DataTableHead>Estado</DataTableHead>
                    <DataTableHead className="text-right">Acciones</DataTableHead>
                  </DataTableRow>
                </DataTableHeader>
                <DataTableBody>
                  {filteredProducts.map((product, index) => (
                    <DataTableRow key={product.id} index={index}>
                      <DataTableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-600 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </DataTableCell>
                      <DataTableCell>
                        <AnimatedBadge variant="outline">{product.category}</AnimatedBadge>
                      </DataTableCell>
                      <DataTableCell className="font-medium">
                        {formatPrice(product.price)}
                      </DataTableCell>
                      <DataTableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{product.stock}</span>
                          {getStockBadge(product.stock)}
                        </div>
                      </DataTableCell>
                      <DataTableCell>
                        <StatusBadge status={product.isActive} />
                      </DataTableCell>
                      <DataTableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Actualizar stock
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {product.isActive ? 'Desactivar' : 'Activar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTable>
            )}
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Productos Activos"
            value={filteredProducts.filter(p => p.isActive).length}
            description="Productos disponibles"
            icon={Package}
          />
          
          <StatCard
            title="Sin Stock"
            value={filteredProducts.filter(p => p.stock === 0).length}
            description="Productos agotados"
            icon={Package}
            className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50"
          />
          
          <StatCard
            title="Precio Promedio"
            value={filteredProducts.length > 0 
              ? formatPrice(filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length)
              : formatPrice(0)
            }
            description="Precio promedio del catálogo"
            icon={Package}
          />
          
          <StatCard
            title="Categorías"
            value={new Set(filteredProducts.map(p => p.category)).size}
            description="Categorías diferentes"
            icon={Package}
          />
        </div>
      </div>
    </div>
  )
}
