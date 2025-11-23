"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useApp } from "./AppContext";

export function Hero() {
  const { navigateTo } = useApp();
  const text = "Descubre el placer con elegancia";
  const words = text.split(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{ zIndex: 0 }}>
      {/* Animated Background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"
        />
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(215, 38, 107, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(182, 30, 92, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(215, 38, 107, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1737920459846-2d0318700658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZWxlZ2FudCUyMGx1eHVyeXxlbnwxfHx8fDE3NjA1NDQxMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-8"
        >
          {/* Animated Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.15,
                }}
                className="inline-block mr-4 bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 max-w-2xl mx-auto px-4"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
          >
            Explora nuestra colección exclusiva diseñada para tu bienestar y placer
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4"
          >
            <motion.button
              onClick={() => navigateTo("catalog")}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 0, 184, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] rounded-full overflow-hidden w-full sm:w-auto"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2 text-white text-sm sm:text-base">
                <span>Explorar Tienda</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#f6b611] to-[#8b00b8]"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              onClick={() => {
                const productsSection = document.getElementById('productos');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#8b00b8]/50 hover:border-[#8b00b8] rounded-full text-foreground transition-colors duration-300 w-auto mx-auto sm:mx-0 text-sm sm:text-base"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
            >
              Ver Ofertas
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
