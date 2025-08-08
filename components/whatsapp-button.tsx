"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  position?: "bottom-right" | "bottom-left"
}

export function WhatsAppButton({ 
  phoneNumber = "+5219932081792", // Número real de RESET Multiservicios: +52 1 993 208 1792
  message = "¡Hola! Me gustaría solicitar información sobre sus servicios.",
  position = "bottom-right"
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const predefinedMessages = [
    {
      title: "Consulta General",
      message: "¡Hola! Me gustaría obtener más información sobre sus servicios."
    },
    {
      title: "Solicitar Cotización",
      message: "Hola, necesito una cotización para un servicio. ¿Podrían ayudarme?"
    },
    {
      title: "Servicio de Emergencia",
      message: "¡Urgente! Necesito asistencia técnica inmediata. ¿Están disponibles?"
    },
    {
      title: "Soporte Técnico",
      message: "Hola, tengo un problema técnico y necesito soporte. ¿Pueden ayudarme?"
    }
  ]

  const openWhatsApp = (customMessage?: string) => {
    const finalMessage = customMessage || message
    const encodedMessage = encodeURIComponent(finalMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  const positionClass = position === "bottom-right" 
    ? "bottom-6 right-6" 
    : "bottom-6 left-6"

  return (
    <div className={`fixed ${positionClass} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-80 shadow-lg border-green-200">
              <CardHeader className="bg-green-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">¿En qué podemos ayudarte?</CardTitle>
                      <CardDescription className="text-green-100">
                        Selecciona una opción o escribe tu mensaje
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-green-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {predefinedMessages.map((msg, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => openWhatsApp(msg.message)}
                      className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-200"
                    >
                      <div className="font-medium text-sm text-gray-900">{msg.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{msg.message}</div>
                    </motion.button>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="pt-2"
                  >
                    <Button 
                      onClick={() => openWhatsApp()}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Abrir WhatsApp
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg border-4 border-white"
          size="lg"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}
