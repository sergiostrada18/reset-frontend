"use client"

import { useCallback } from 'react'

export function useScrollToSection() {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Altura aproximada del header
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  return scrollToSection
}

export function useNavigateToSection() {
  const scrollToSection = useScrollToSection()
  
  const navigateToSection = useCallback((href: string) => {
    // Si el href es un anchor link (empieza con #)
    if (href.startsWith('#')) {
      const sectionId = href.slice(1) // Remover el #
      scrollToSection(sectionId)
    } else {
      // Para links externos, usar navegación normal
      window.location.href = href
    }
  }, [scrollToSection])

  return navigateToSection
}
