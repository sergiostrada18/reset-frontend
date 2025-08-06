import { motion } from "framer-motion"
import { Plus, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps {
  onClick: () => void
  icon?: LucideIcon
  label?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "success" | "danger"
  className?: string
}

const positionStyles = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6", 
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
}

const sizeStyles = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
}

const variantStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-gray-500/25",
  success: "bg-green-600 hover:bg-green-700 text-white shadow-green-500/25",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/25",
}

export function FloatingActionButton({
  onClick,
  icon: Icon = Plus,
  label,
  position = "bottom-right",
  size = "md", 
  variant = "primary",
  className,
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed z-50 rounded-full shadow-lg transition-all duration-300",
        "hover:shadow-xl active:scale-95",
        "flex items-center justify-center",
        positionStyles[position],
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17,
        delay: 0.2 
      }}
    >
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="h-6 w-6" />
      </motion.div>
      
      {label && (
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: "auto", opacity: 1 }}
          className="ml-2 whitespace-nowrap overflow-hidden text-sm font-medium"
        >
          {label}
        </motion.span>
      )}

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  )
}
