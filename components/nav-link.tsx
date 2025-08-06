"use client"

import { useNavigateToSection } from '@/hooks/use-navigation'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function NavLink({ href, children, className = "", onClick }: NavLinkProps) {
  const navigateToSection = useNavigateToSection()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigateToSection(href)
    onClick?.() // Para cerrar menús móviles, etc.
  }

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
