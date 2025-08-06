/**
 * Convierte una URL relativa a una URL completa
 */
export function getFullImageUrl(url: string): string {
  if (!url) return ''
  
  // Si ya es una URL completa, devolverla tal como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Si es una URL relativa, agregar el host del backend
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  // Asegurar que la URL relativa empiece con /
  const relativeUrl = url.startsWith('/') ? url : `/${url}`
  
  return `${backendUrl}${relativeUrl}`
}

/**
 * Convierte URLs de imagen en objetos carousel slides
 */
export function processCarouselSlideImages<T extends { image_url?: string }>(slides: T[]): T[] {
  return slides.map(slide => ({
    ...slide,
    image_url: slide.image_url ? getFullImageUrl(slide.image_url) : undefined
  }))
}
