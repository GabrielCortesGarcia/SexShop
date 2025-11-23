"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "María L.",
    rating: 5,
    text: "Excelente servicio, envío discreto y productos de altísima calidad. Volveré a comprar sin duda.",
    date: "Hace 2 semanas",
  },
  {
    id: 2,
    name: "Carlos R.",
    rating: 5,
    text: "La atención al cliente es impecable. Me ayudaron a elegir el producto perfecto para mi pareja y nosotros.",
    date: "Hace 1 mes",
  },
  {
    id: 3,
    name: "Ana G.",
    rating: 5,
    text: "Muy satisfecha con mi compra. El empaque es completamente discreto y la calidad supera las expectativas.",
    date: "Hace 3 semanas",
  },
  {
    id: 4,
    name: "Roberto M.",
    rating: 5,
    text: "Productos de primera, envío rápido y total privacidad. Una experiencia de compra excepcional.",
    date: "Hace 1 semana",
  },
];

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background relative overflow-hidden">
      {/* Background Gradient Animation */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 50% 0%, rgba(215, 38, 107, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 100%, rgba(182, 30, 92, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 0%, rgba(215, 38, 107, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
          >
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p
            className="text-foreground/70 max-w-2xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
          >
            Testimonios reales de personas que confiaron en nosotros
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-card/80 to-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border hover:border-[#8b00b8]/30 transition-all duration-300 overflow-hidden">
                {/* Quote Icon Background */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-24 h-24 text-[#8b00b8]" />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                      >
                        <Star className="w-5 h-5 fill-[#f6b611] text-[#f6b611]" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p
                    className="text-foreground/90 leading-relaxed"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                  >
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <h4
                        className="text-foreground"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {testimonial.name}
                      </h4>
                      <p
                        className="text-foreground/50 text-sm"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        {testimonial.date}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b00b8] to-[#f6b611] flex items-center justify-center">
                      <span
                        className="text-white text-xl"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gradient Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#8b00b8]/0 via-[#f6b611]/0 to-[#8b00b8]/0 group-hover:from-[#8b00b8]/5 group-hover:via-[#f6b611]/3 group-hover:to-[#8b00b8]/5 transition-all duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col items-center space-y-2 px-8 py-6 bg-gradient-to-r from-card via-muted to-card rounded-2xl border border-[#8b00b8]/20">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 fill-[#f6b611] text-[#f6b611]" />
              <span
                className="text-4xl text-foreground"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
              >
                4.9
              </span>
            </div>
            <p
              className="text-foreground/70"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
            >
              Basado en más de 2,500 reseñas verificadas
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
