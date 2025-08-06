import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  className?: string
  showFilter?: boolean
}

export function SearchBar({
  placeholder = "Buscar...",
  value,
  onChange,
  onFilterClick,
  className,
  showFilter = true,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      className={cn(
        "relative flex items-center space-x-2",
        className
      )}
    >
      <div
        className={cn(
          "relative flex-1 transition-all duration-300",
          isFocused && "scale-[1.02]"
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 pr-10 transition-all duration-300",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            isFocused && "shadow-lg shadow-blue-500/10"
          )}
        />
        
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {showFilter && (
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="transition-all duration-300 hover:scale-105"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      )}
    </motion.div>
  )
}
