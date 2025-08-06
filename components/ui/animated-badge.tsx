import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export type BadgeVariant = 
  | "default" 
  | "secondary" 
  | "success" 
  | "warning" 
  | "danger" 
  | "info"
  | "outline"

export type BadgeSize = "sm" | "md" | "lg"

interface AnimatedBadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: LucideIcon
  pulse?: boolean
  className?: string
}

const variantStyles = {
  default: "bg-primary text-primary-foreground border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-secondary/20",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  outline: "border-2 border-gray-200 text-gray-700 bg-transparent",
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
}

export function AnimatedBadge({
  children,
  variant = "default",
  size = "md",
  icon: Icon,
  pulse = false,
  className,
}: AnimatedBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        pulse && "animate-pulse",
        className
      )}
    >
      {Icon && <Icon className="mr-1 h-3 w-3" />}
      {children}
    </motion.span>
  )
}

interface StatusBadgeProps {
  status: boolean
  activeText?: string
  inactiveText?: string
  className?: string
}

export function StatusBadge({
  status,
  activeText = "Activo",
  inactiveText = "Inactivo",
  className,
}: StatusBadgeProps) {
  return (
    <AnimatedBadge
      variant={status ? "success" : "secondary"}
      className={className}
    >
      <motion.div
        className={cn(
          "w-2 h-2 rounded-full mr-2",
          status ? "bg-green-500" : "bg-gray-400"
        )}
        animate={status ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {status ? activeText : inactiveText}
    </AnimatedBadge>
  )
}

interface CountBadgeProps {
  count: number
  maxCount?: number
  showZero?: boolean
  className?: string
}

export function CountBadge({
  count,
  maxCount = 99,
  showZero = false,
  className,
}: CountBadgeProps) {
  if (!showZero && count === 0) return null

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  return (
    <motion.span
      key={count}
      initial={{ scale: 1.5 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full",
        className
      )}
    >
      {displayCount}
    </motion.span>
  )
}
