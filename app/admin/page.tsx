"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  Users,
  Package,
  Activity,
  LogOut,
  Menu,
  X,
  Home,
  Camera
} from "lucide-react"
import { ResetLogo } from "@/components/reset-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { useServices, useProducts } from "@/hooks/use-data"

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { services, loading: servicesLoading } = useServices()
  const { products, loading: productsLoading } = useProducts()
  const router = useRouter()

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

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  const statsCards = [
    {
      title: "Total Servicios",
      value: services?.length || 0,
      description: "Servicios activos",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Total Productos", 
      value: products?.length || 0,
      description: "Productos en catálogo",
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Usuarios",
      value: "12",
      description: "Usuarios registrados",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Configuración",
      value: "5",
      description: "Ajustes pendientes",
      icon: Settings,
      color: "text-orange-600",
    },
  ]

  const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: Activity, current: true },
    { name: "Carousel", href: "/admin/carousel", icon: Camera },
    { name: "Servicios", href: "/admin/services", icon: Settings },
    { name: "Productos", href: "/admin/products", icon: Package },
    { name: "Usuarios", href: "/admin/users", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-2">
              <ResetLogo className="h-8 w-12" />
              <span className="text-xl font-bold">RESET Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${item.current 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r shadow-sm">
          <div className="flex h-16 items-center px-4 border-b">
            <div className="flex items-center space-x-2">
              <ResetLogo className="h-8 w-12" />
              <span className="text-xl font-bold">RESET Admin</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${item.current 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-900 lg:ml-0">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Admin</Badge>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statsCards.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                trend={stat.title === "Total Servicios" ? { value: 12, isPositive: true } : undefined}
              />
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Carousel</CardTitle>
                <CardDescription>
                  Gestiona los slides del carousel principal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    Slides principales
                  </span>
                  <Link href="/admin/carousel">
                    <Button size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Gestionar
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-gray-500">
                  Administra las imágenes y contenido del carousel de la página principal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
                <CardDescription>
                  Gestiona los servicios disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {servicesLoading ? 'Cargando...' : `${services?.length || 0} servicios`}
                  </span>
                  <Link href="/admin/services">
                    <Button size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Gestionar
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {services?.slice(0, 3).map((service, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <span className="text-sm font-medium">{service.name}</span>
                      <Badge variant="outline" className="text-xs">
                        ${service.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>
                  Gestiona el catálogo de productos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {productsLoading ? 'Cargando...' : `${products?.length || 0} productos`}
                  </span>
                  <Link href="/admin/products">
                    <Button size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Gestionar
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {products?.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <span className="text-sm font-medium">{product.name}</span>
                      <Badge variant="outline" className="text-xs">
                        ${product.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
