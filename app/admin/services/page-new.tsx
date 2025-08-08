"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  ArrowLeft,
  Eye,
  EyeOff,
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
import { useServices, useServiceManagement } from "@/hooks/use-data"
import { ServiceModal } from "@/components/ui/service-modal"
import { Service, ServiceCreate, ServiceUpdate } from "@/types"

export default function ServicesManagement() {
  const { services, loading, error, refetch } = useServices()
  const { 
    loading: managementLoading, 
    error: managementError, 
    createService, 
    updateService, 
    deleteService 
  } = useServiceManagement()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredServices, setFilteredServices] = useState(services || [])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  useEffect(() => {
    if (services) {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredServices(filtered)
    }
  }, [services, searchTerm])

  const handleCreateService = () => {
    setSelectedService(null)
    setModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setModalOpen(true)
  }

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (serviceToDelete) {
      const success = await deleteService(serviceToDelete.id)
      if (success) {
        setDeleteDialogOpen(false)
        setServiceToDelete(null)
        await refetch()
      }
    }
  }

  const handleSaveService = async (data: ServiceCreate | ServiceUpdate) => {
    try {
      if (selectedService) {
        // Editar servicio existente
        const result = await updateService(selectedService.id, data as ServiceUpdate)
        if (result) {
          setModalOpen(false)
          setSelectedService(null)
          await refetch()
        }
      } else {
        // Crear nuevo servicio
        const result = await createService(data as ServiceCreate)
        if (result) {
          setModalOpen(false)
          await refetch()
        }
      }
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case 'seguridad': return 'destructive'
      case 'climatizacion': return 'default'
      case 'informatica': return 'secondary'
      case 'mantenimiento': return 'outline'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando servicios...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
                <p className="text-gray-600">Administra todos los servicios disponibles</p>
              </div>
            </div>
            <Button onClick={handleCreateService}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services?.filter(s => s.is_active).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Inactivos</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services?.filter(s => !s.is_active).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${services?.length ? (services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(0) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Servicios</CardTitle>
                <CardDescription>
                  {filteredServices.length} servicios encontrados
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No se encontraron servicios</div>
                <Button onClick={handleCreateService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer servicio
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {service.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCategoryBadgeVariant(service.category)}>
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${service.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {service.estimated_duration} min
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.is_active ? "default" : "secondary"}>
                          {service.is_active ? "Activo" : "Inactivo"}
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
                            <DropdownMenuItem onClick={() => handleEditService(service)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteService(service)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Modal */}
      <ServiceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        service={selectedService}
        onSave={handleSaveService}
        loading={managementLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el servicio "{serviceToDelete?.name}".
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
