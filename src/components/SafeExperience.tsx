"use client";

import { motion } from "motion/react";
import { Lock, Package, Truck, Shield } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Lock,
    title: "Pago Seguro",
    description: "Transacciones encriptadas y totalmente seguras",
  },
  {
    id: 2,
    icon: Package,
    title: "Empaque Discreto",
    description: "Envíos en cajas sin marcas ni referencias",
  },
  {
    id: 3,
    icon: Truck,
    title: "Envío Rápido",
    description: "Entrega en 24-48 horas a todo el país",
  },
  {
    id: 4,
    icon: Shield,
    title: "Privacidad Total",
    description: "Tus datos protegidos con máxima confidencialidad",
  },
];

export function SafeExperience() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #8b00b8 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

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
            Experiencia Segura
          </h2>
          <p
            className="text-foreground/70 max-w-2xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
          >
            Tu confianza y privacidad son nuestra prioridad absoluta
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-card to-background rounded-2xl p-8 border border-border hover:border-[#8b00b8]/30 transition-all duration-300 overflow-hidden">
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#8b00b8]/0 to-[#f6b611]/0 group-hover:from-[#8b00b8]/10 group-hover:to-[#f6b611]/5 transition-all duration-300"
                  />

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Icon Container */}
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                      className="inline-flex"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8b00b8] to-[#f6b611] p-4 shadow-lg shadow-[#8b00b8]/20">
                        <Icon className="w-full h-full text-white" />
                      </div>
                    </motion.div>

                    {/* Text */}
                    <div>
                      <h3
                        className="text-xl text-foreground mb-2"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-foreground/70"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8b00b8]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-card via-muted to-card rounded-full border border-[#8b00b8]/30">
            <Shield className="w-6 h-6 text-[#8b00b8]" />
            <span
              className="text-foreground"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Más de 50,000 clientes satisfechos
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
