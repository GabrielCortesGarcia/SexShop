"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    // Número de WhatsApp (reemplazar con el número real)
    const phoneNumber = "5215512345678"; // Formato: código país + número sin espacios
    const message = encodeURIComponent(
      "¡Hola! Me gustaría obtener más información sobre sus productos."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: 1,
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 10px 40px rgba(37, 211, 102, 0.4)"
      }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[9997] w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-2xl flex items-center justify-center group transition-colors duration-300"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse Animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* WhatsApp Icon */}
      <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-3 px-4 py-2 bg-card border border-border rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
      >
        <span className="text-sm text-foreground">¿Necesitas ayuda?</span>
        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-card border-r border-t border-border transform rotate-45 -translate-y-1/2" />
      </motion.div>
    </motion.button>
  );
}
