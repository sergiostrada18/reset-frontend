"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCarouselSlides } from "@/hooks/use-data"

interface StaticSlide {
  src: string
  alt: string
  title: string
  description: string
}

const carouselImages: StaticSlide[] = [
  {
    src: "/placeholder.svg?height=600&width=1200",
    alt: "Instalación profesional de cámaras de seguridad",
    title: "Sistemas de Seguridad Profesional",
    description: "Protege tu hogar y negocio con nuestras cámaras de última tecnología",
  },
  {
    src: "/placeholder.svg?height=600&width=1200",
    alt: "Servicios de informática especializada",
    title: "Servicios de Informática",
    description: "Soporte técnico, reparación de equipos y soluciones IT integrales",
  },
  {
    src: "/placeholder.svg?height=600&width=1200",
    alt: "Instalación y mantenimiento de aires acondicionados",
    title: "Climatización Profesional",
    description: "Instalación, mantenimiento y reparación de sistemas de climatización",
  },
]

export default function CarouselClient() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { slides: carouselSlides, loading: carouselLoading, refetch: refetchSlides } = useCarouselSlides(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Refrescar slides cada 30 segundos para capturar cambios del admin panel
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        refetchSlides()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [mounted, refetchSlides])

  // Determinar qué slides usar - siempre usa los dinámicos si están disponibles
  const activeSlides = useMemo(() => {
    if (!mounted) return carouselImages // Durante SSR usar slides estáticos para evitar hidratación
    return carouselSlides && carouselSlides.length > 0 ? carouselSlides : carouselImages
  }, [mounted, carouselSlides])

  useEffect(() => {
    if (mounted && activeSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [activeSlides.length, mounted])

  // Reset currentSlide when slides change to avoid index out of bounds
  useEffect(() => {
    if (activeSlides.length > 0 && currentSlide >= activeSlides.length) {
      setCurrentSlide(0)
    }
  }, [activeSlides.length, currentSlide])

  const nextSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }
  }

  const prevSlide = () => {
    if (activeSlides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
    }
  }

  // Mostrar loader solo durante la carga de datos del backend
  if (carouselLoading && mounted) {
    return (
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Cargando slides desde base de datos...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="inicio" className="relative h-[600px] overflow-hidden" suppressHydrationWarning={true}>
      <div className="relative w-full h-full">
        {activeSlides.map((slide, index) => {
          // Determinar si es slide dinámico (del backend) o estático
          const isCarouselSlide = slide && typeof slide === 'object' && ('id' in slide || '_id' in slide)

          let slideData
          if (isCarouselSlide) {
            // Slide dinámico del backend
            const carouselSlide = slide as any
            slideData = {
              src: carouselSlide.image_url || "/placeholder.svg",
              alt: carouselSlide.title || "",
              title: carouselSlide.title || "",
              description: carouselSlide.description || "",
              buttonText: carouselSlide.button_text,
              buttonLink: carouselSlide.button_link,
              showButton: carouselSlide.show_button || false,
              key: carouselSlide.id || carouselSlide._id
            }
          } else {
            // Slide estático
            const staticSlide = slide as StaticSlide
            slideData = {
              src: staticSlide.src || "/placeholder.svg",
              alt: staticSlide.alt || "",
              title: staticSlide.title || "",
              description: staticSlide.description || "",
              buttonText: null,
              buttonLink: null,
              showButton: true, // Los slides estáticos siempre muestran botones
              key: `static-${index}`
            }
          }

          return (
            <div
              key={slideData.key}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slideData.src}
                alt={slideData.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slideData.title}</h1>
                  <p className="text-xl md:text-2xl mb-8">{slideData.description}</p>
                  {slideData.showButton && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {slideData.buttonText && slideData.buttonLink ? (
                        <Link href={slideData.buttonLink}>
                          <Button size="lg" className="bg-primary hover:bg-primary/90">
                            {slideData.buttonText}
                          </Button>
                        </Link>
                      ) : (
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                          Ver Servicios
                        </Button>
                      )}
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 border-white text-white hover:bg-white/20"
                      >
                        Solicitar Cotización
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
