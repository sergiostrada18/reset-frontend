import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type ConfirmationType = "danger" | "warning" | "info"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmationType
  loading?: boolean
}

const typeConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: "text-red-500",
    confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
    iconBg: "bg-red-100",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    confirmButtonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
    iconBg: "bg-yellow-100",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
    iconBg: "bg-blue-100",
  },
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "info",
  loading = false,
}: ConfirmationModalProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm()
    if (!loading) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>

              <div className="p-6">
                {/* Icon */}
                <div className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-full", config.iconBg)}>
                  <Icon className={cn("h-6 w-6", config.iconColor)} />
                </div>

                {/* Content */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={cn("flex-1", config.confirmButtonClass)}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Procesando...
                      </div>
                    ) : (
                      confirmText
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook para manejar confirmaciones
export function useConfirmation() {
  return (options: Omit<ConfirmationModalProps, "isOpen" | "onClose">) => {
    return new Promise<boolean>((resolve) => {
      // Esta sería la implementación completa en un contexto real
      // Por ahora usamos el confirm nativo del browser
      const result = confirm(`${options.title}\n\n${options.description}`)
      resolve(result)
    })
  }
}
