"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { NavLink } from "@/components/nav-link"
import { IconDisplay } from "@/components/ui/icon-selector"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Wrench,
  Monitor,
  Home,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Loader,
  Camera
} from "lucide-react"
import { ResetLogo } from "@/components/reset-logo"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useServices, useProducts } from "@/hooks/use-data"
import { Service, Product } from "@/types"
import CarouselClient from "@/components/carousel-client"
import { apiClient } from "@/lib/api-client"

// Interfaces locales para datos estáticos
interface StaticService {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
}

interface StaticProduct {
  name: string;
  price: string;
  image: string;
  features: string[];
}

const carouselImages = [
  {
    src: "/placeholder.svg?height=600&width=1200",
    alt: "Instalación profesional de cámaras de seguridad",
    title: "Sistemas de Seguridad Profesional",
    description: "Protege tu hogar y negocio con nuestras cámaras de última tecnología",
  },
  {
    src: "/placeholder.svg?height=600&width=1200",
    alt: "Técnico reparando aire acondicionado",
    title: "Servicio Técnico Especializado",
    description: "Reparación y mantenimiento de aires acondicionados con garantía",
  },
  {
    src: "/placeholder.svg?height=600&width=1200",
    alt: "Servicios de informática y reparación",
    title: "Servicios de Informática",
    description: "Soporte técnico, reparación de equipos y soluciones IT integrales",
  },
  {
    src: "/placeholder.svg?height=600&width=1200",
    alt: "Reparaciones generales del hogar",
    title: "Reparaciones Generales",
    description: "Mantenimiento y reparaciones para tu hogar y negocio",
  },
]

const services: StaticService[] = [
  {
    icon: Camera,
    title: "Sistemas de Seguridad",
    description: "Cámaras IP, CCTV, alarmas y control de acceso",
    features: ["Cámaras HD/4K", "Monitoreo remoto", "Grabación en la nube", "Instalación profesional"],
  },
  {
    icon: Wrench,
    title: "Aires Acondicionados",
    description: "Instalación, reparación y mantenimiento",
    features: ["Todas las marcas", "Servicio 24/7", "Repuestos originales", "Garantía extendida"],
  },
  {
    icon: Monitor,
    title: "Servicios de Informática",
    description: "Soporte técnico y soluciones IT",
    features: ["Reparación de PC", "Redes y WiFi", "Software y hardware", "Consultoría IT"],
  },
  {
    icon: Home,
    title: "Reparaciones Generales",
    description: "Mantenimiento integral para hogar y negocio",
    features: ["Electricidad", "Plomería", "Carpintería", "Pintura y acabados"],
  },
]

const products: StaticProduct[] = [
  {
    name: "Cámara IP 4K",
    price: "$299",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Resolución 4K", "Visión nocturna", "Audio bidireccional", "Resistente al agua"],
  },
  {
    name: "Kit de 4 Cámaras",
    price: "$899",
    image: "/placeholder.svg?height=300&width=300",
    features: ["4 cámaras HD", "DVR incluido", "Cables y accesorios", "App móvil gratuita"],
  },
  {
    name: "Aire Split 12000 BTU",
    price: "$599",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Inverter", "Bajo consumo", "Control remoto", "Instalación incluida"],
  },
  {
    name: "Sistema de Alarma",
    price: "$399",
    image: "/placeholder.svg?height=300&width=300",
    features: ["Sensores inalámbricos", "Panel táctil", "Notificaciones móvil", "Batería de respaldo"],
  },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentSection, setCurrentSection] = useState<'inicio' | 'servicios' | 'catalogo' | 'nosotros' | 'contacto'>('inicio')
  const { services: backendServices, loading: servicesLoading, error: servicesError } = useServices()
  const { products: backendProducts, loading: productsLoading, error: productsError } = useProducts()

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Función para abrir WhatsApp con mensaje personalizado
  const openWhatsApp = (message: string) => {
    const phoneNumber = "+5219932081792" // Número real de RESET Multiservicios
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center space-x-2 ml-4"
          >
            <NavLink href="#inicio" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ResetLogo className="h-8 w-12" />
              <span className="text-xl font-bold">RESET Multiservicios</span>
            </NavLink>
          </motion.div>
          <motion.nav 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:flex items-center space-x-6"
          >
            <NavLink href="#inicio" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </NavLink>
            <NavLink href="#servicios" className="text-sm font-medium hover:text-primary transition-colors">
              Servicios
            </NavLink>
            <NavLink href="#catalogo" className="text-sm font-medium hover:text-primary transition-colors">
              Catálogo
            </NavLink>
            <NavLink href="#nosotros" className="text-sm font-medium hover:text-primary transition-colors">
              Nosotros
            </NavLink>
            {/** Contacto deshabilitado temporalmente */}
          </motion.nav>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button onClick={() => openWhatsApp("Hola! Me gustaría más información.")}>
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Carousel */}
      <CarouselClient />

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos soluciones integrales para la seguridad, mantenimiento y tecnología de tu hogar o negocio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesLoading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin mr-2" />
                <span>Cargando servicios...</span>
              </div>
            ) : servicesError ? (
              <div className="col-span-full text-center py-12 text-red-500">
                Error al cargar servicios: {servicesError}
              </div>
            ) : (
              (backendServices && backendServices.length > 0 ? backendServices : services)
                .slice(0, 12)
                .map((service, index) => {
                const isStaticService = 'title' in service; // Los servicios estáticos tienen 'title', los del backend tienen 'name'
                const serviceTitle = isStaticService ? (service as StaticService).title : (service as Service).name;
                const serviceDescription = service.description;
                const serviceFeatures = isStaticService 
                  ? (service as StaticService).features 
                  : (service as Service).features;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="text-center hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <motion.div 
                          className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isStaticService ? (
                            (() => {
                              const IconComponent = (service as StaticService).icon;
                              return <IconComponent className="h-8 w-8 text-primary" />;
                            })()
                          ) : mounted ? (
                            <IconDisplay 
                              iconName={(service as Service).icon || "wrench"} 
                              className="text-primary" 
                              size={32} 
                            />
                          ) : (
                            <Wrench className="h-8 w-8 text-primary" />
                          )}
                        </motion.div>
                        <CardTitle className="text-xl">{serviceTitle}</CardTitle>
                        <CardDescription>{serviceDescription}</CardDescription>
                        {!isStaticService && (service as Service).price !== undefined && (
                          <div className="mt-2">
                            <span className="text-2xl font-bold text-primary">${(service as Service).price}</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {serviceFeatures.map((feature: string, featureIndex: number) => (
                            <motion.li 
                              key={featureIndex} 
                              className="flex items-center text-sm"
                              initial={{ x: -20, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
          
          {/* Enlace para ver todos los servicios */}
          {((backendServices && backendServices.length > 12) || (!backendServices && services.length > 12)) && (
            <div className="text-center mt-12">
              <Link
                href="/servicios"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ver todos los servicios
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Products Catalog */}
      <section id="catalogo" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Catálogo de Productos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Productos de alta calidad con garantía y soporte técnico especializado
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsLoading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin mr-2" />
                <span>Cargando productos...</span>
              </div>
            ) : productsError ? (
              <div className="col-span-full text-center py-12 text-red-500">
                Error al cargar productos: {productsError}
              </div>
            ) : (
              (backendProducts && backendProducts.length > 0 ? backendProducts : products)
                .slice(0, 8)
                .map((product, index) => {
                const isStaticProduct = 'image' in product && typeof (product as any).price === 'string';
                const productName = product.name;
                const productPrice = isStaticProduct 
                  ? (product as StaticProduct).price 
                  : `$${(product as Product).price}`;
                const productFeatures = product.features;

                return (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <motion.div 
                        className="aspect-square relative bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center overflow-hidden rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isStaticProduct ? (
                          <Image
                            src={(product as StaticProduct).image}
                            alt={(product as StaticProduct).name}
                            fill
                            className="object-cover"
                            priority
                          />
                        ) : (product as Product).image ? (
                          <Image
                            src={(product as Product).image!}
                            alt={(product as Product).name}
                            fill
                            className="object-cover"
                            priority
                          />
                        ) : mounted ? (
                          <IconDisplay 
                            iconName={(product as Product).icon || "package"} 
                            className="text-primary" 
                            size={64} 
                          />
                        ) : (
                          <Monitor className="h-16 w-16 text-primary" />
                        )}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <Badge className="absolute top-2 right-2 bg-primary">Nuevo</Badge>
                        </motion.div>
                      </motion.div>
                      <CardHeader>
                        <CardTitle className="text-lg">{productName}</CardTitle>
                        <motion.div 
                          className="text-2xl font-bold text-primary"
                          whileInView={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          {productPrice}
                        </motion.div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 mb-4">
                          {productFeatures.map((feature: string, featureIndex: number) => (
                            <motion.li 
                              key={featureIndex} 
                              className="text-sm text-muted-foreground flex items-center"
                              initial={{ x: -20, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            className="w-full"
                            onClick={() => openWhatsApp(`Hola, me interesa el producto: ${productName}. ¿Podrían darme más información?`)}
                          >
                            Solicitar Información
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
          
          {/* Enlace para ver todos los productos */}
          {((backendProducts && backendProducts.length > 8) || (!backendProducts && products.length > 8)) && (
            <div className="text-center mt-12">
              <Link
                href="/productos"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ver todos los productos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Us */}
      <section id="nosotros" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Sobre RESET Multiservicios
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground mb-6"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Con más de 10 años de experiencia en el mercado, somos una empresa líder en servicios técnicos
                especializados y productos de seguridad. Nuestro compromiso es brindar soluciones integrales de alta
                calidad para hogares y negocios.
              </motion.p>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {[
                  { number: "500+", text: "Clientes Satisfechos" },
                  { number: "10+", text: "Años de Experiencia" },
                  { number: "24/7", text: "Soporte Técnico" },
                  { number: "100%", text: "Garantía" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="text-3xl font-bold text-primary mb-2"
                      whileInView={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">{stat.text}</div>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="flex items-center space-x-1 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
                  >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.9/5 en reseñas de clientes</span>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Mostrar GIF servido por el backend */}
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/uploads/images/about.gif`}
                  alt="Demostración de servicios RESET Multiservicios"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

  {/** Contact Section temporalmente deshabilitada */}
  {false && (
  <section id="contacto" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos para una cotización gratuita
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {[
                { icon: Phone, title: "Teléfono", main: "993 208 1792", sub1: "Lun - Vie: 8:00 AM - 6:00 PM", sub2: "Emergencias 24/7" },
                { icon: Mail, title: "Email", main: "info@resetmultiservicios.com", sub1: "Respuesta en 24 horas", sub2: "Cotizaciones gratuitas" },
                { icon: MapPin, title: "Ubicación", main: "Reset - Tabasco, México", sub1: "Servicio a domicilio disponible", sub2: "Cobertura en todo el estado" }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-primary/10 p-3 rounded-full"
                        >
                          <contact.icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{contact.title}</CardTitle>
                          <p className="text-lg font-semibold text-primary">{contact.main}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{contact.sub1}</p>
                      <p className="text-sm text-muted-foreground">{contact.sub2}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Google Maps */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-8"
            >
              <Card className="overflow-hidden h-full min-h-[400px]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Nuestra Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full h-[400px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d933.7951117585162!2d-92.94956584302976!3d17.99877940746598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85edd7aad75c77ab%3A0xadca46b0dcb8e90c!2sReset!5e0!3m2!1ses-419!2smx!4v1690834567890!5m2!1ses-419!2smx"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-b-lg"
                      title="Ubicación Reset Multiservicios - Tabasco, México"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

      {/* Contacto rápido: formulario mínimo */}
      <ContactMiniForm />
        </div>
      </section>
    )}

      {/* Footer */}
      <motion.footer 
        className="bg-muted py-12"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink href="#inicio" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <ResetLogo className="h-6 w-9" />
                  <span className="text-lg font-bold">RESET Multiservicios</span>
                </NavLink>
              </motion.div>
              <p className="text-sm text-muted-foreground mb-4">
                Soluciones integrales en seguridad, mantenimiento y tecnología para tu hogar y negocio.
              </p>
              <div className="flex items-center space-x-1" suppressHydrationWarning>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
                <span className="ml-2 text-xs text-muted-foreground">4.9/5</span>
              </div>
            </motion.div>

            {[
              { title: "Servicios", items: [
                  { text: "Cámaras de Seguridad", href: "#servicios" },
                  { text: "Aires Acondicionados", href: "#servicios" },
                  { text: "Servicios de Informática", href: "#servicios" },
                  { text: "Reparaciones Generales", href: "#servicios" }
                ]},
              { title: "Empresa", items: [
                  { text: "Sobre Nosotros", href: "#nosotros" },
                  { text: "Nuestro Equipo", href: "#nosotros" },
                  { text: "Testimonios", href: "#nosotros" },
                  { text: "Garantías", href: "#nosotros" }
                ]},
              { 
                title: "Contacto", 
                items: [
                  { icon: Phone, text: "993 208 1792" },
                  { icon: Mail, text: "info@resetmultiservicios.com" },
                  { icon: Clock, text: "Lun-Vie 8AM-6PM" }
                ]
              }
            ].map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold mb-4">{section.title}</h3>
                {section.title === "Contacto" ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {(section.items as any[]).map((item, itemIndex) => (
                      <motion.div 
                        key={itemIndex}
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.text}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {(section.items as any[]).map((item, itemIndex) => (
                      <motion.li 
                        key={itemIndex}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer hover:text-primary"
                      >
                        {item.href ? (
                          <NavLink href={item.href} className="hover:text-primary transition-colors">
                            {item.text}
                          </NavLink>
                        ) : (
                          item.text || item
                        )}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2024 RESET Multiservicios. Todos los derechos reservados.</p>
          </motion.div>
        </div>
      </motion.footer>

      {/* WhatsApp Button */}
      <WhatsAppButton 
        phoneNumber="+5219932081792" // Número real de RESET Multiservicios
        position="bottom-right"
      />
    </div>
  )
}

// Temporalmente deshabilitado
function ContactMiniForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!name.trim() || !phone.trim()) {
      setError("Nombre y teléfono son obligatorios")
      return
    }
    try {
      setSubmitting(true)
      const res = await apiClient.submitContactMinimal({ name: name.trim(), phone: phone.trim(), message: message.trim() || undefined })
      setSuccess(res.message || "Enviado. Te contactaremos pronto.")
      setName("")
      setPhone("")
      setMessage("")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo enviar. Intenta más tarde.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto mt-12"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 bg-card p-4 rounded-lg shadow-sm">
        <div className="md:col-span-1">
          <label className="block text-sm mb-1">Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border p-2" placeholder="Tu nombre" required />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm mb-1">Teléfono</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border p-2" placeholder="Tu teléfono" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Comentario (opcional)</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-md border p-2" placeholder="Cuéntanos brevemente..." rows={3} />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar"}
          </Button>
          {success && <span className="text-green-600 text-sm">{success}</span>}
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
      </form>
    </motion.div>
  )
}
