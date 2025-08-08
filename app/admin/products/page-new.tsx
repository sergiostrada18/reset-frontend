"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  ArrowLeft,
  Eye,
  EyeOff,
  ShoppingCart,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProducts, useProductManagement } from "@/hooks/use-data"
import { ProductModal } from "@/components/ui/product-modal"
import { Product, ProductCreate, ProductUpdate } from "@/types"

export default function ProductsManagement() {
  const { products, loading, error, refetch } = useProducts()
  const { 
    loading: managementLoading, 
    error: managementError, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useProductManagement()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products || [])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

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

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      const success = await deleteProduct(productToDelete.id)
      if (success) {
        setDeleteDialogOpen(false)
        setProductToDelete(null)
        await refetch()
      }
    }
  }

  const handleSaveProduct = async (data: ProductCreate | ProductUpdate) => {
    try {
      if (selectedProduct) {
        // Editar producto existente
        const result = await updateProduct(selectedProduct.id, data as ProductUpdate)
        if (result) {
          setModalOpen(false)
          setSelectedProduct(null)
          await refetch()
        }
      } else {
        // Crear nuevo producto
        const result = await createProduct(data as ProductCreate)
        if (result) {
          setModalOpen(false)
          await refetch()
        }
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case 'seguridad': return 'destructive'
      case 'climatizacion': return 'default'
      case 'informatica': return 'secondary'
      case 'mantenimiento': return 'outline'
      case 'accesorios': return 'default'
      default: return 'default'
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sin stock', variant: 'destructive' as const }
    if (stock < 5) return { label: 'Stock bajo', variant: 'secondary' as const }
    return { label: 'En stock', variant: 'default' as const }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalStock = products?.reduce((sum, p) => sum + p.stock, 0) || 0
  const totalValue = products?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0

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
                <p className="text-gray-600">Administra todo el inventario de productos</p>
              </div>
            </div>
            <Button onClick={handleCreateProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products?.filter(p => p.is_active).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(0)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products?.filter(p => p.stock === 0).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Productos</CardTitle>
                <CardDescription>
                  {filteredProducts.length} productos encontrados
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No se encontraron productos</div>
                <Button onClick={handleCreateProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer producto
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoryBadgeVariant(product.category)}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.stock}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
        loading={managementLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto "{productToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Display */}
      {managementError && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-md">
          {managementError}
        </div>
      )}
    </div>
  )
}
