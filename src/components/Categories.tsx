"use client";

import { motion } from "motion/react";
import { Heart, Zap, Gift, Droplet, Sparkles, Users } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Parejas",
    icon: Users,
    color: "from-[#8b00b8] to-[#f6b611]",
  },
  {
    id: 2,
    name: "Vibradores",
    icon: Zap,
    color: "from-[#f6b611] to-[#e0302f]",
  },
  {
    id: 3,
    name: "Juguetes",
    icon: Heart,
    color: "from-[#8b00b8] to-[#e0302f]",
  },
  {
    id: 4,
    name: "Aceites",
    icon: Droplet,
    color: "from-[#e0302f] to-[#f6b611]",
  },
  {
    id: 5,
    name: "Ropa Íntima",
    icon: Sparkles,
    color: "from-[#f6b611] to-[#8b00b8]",
  },
  {
    id: 6,
    name: "Kits Especiales",
    icon: Gift,
    color: "from-[#e0302f] to-[#8b00b8]",
  },
];

export function Categories() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card to-background relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, rgba(215, 38, 107, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 50%, rgba(182, 30, 92, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 50%, rgba(215, 38, 107, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
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
            Categorías
          </h2>
          <p
            className="text-foreground/70 max-w-2xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
          >
            Explora nuestra variada selección organizada para tu conveniencia
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-card to-background border border-border hover:border-[#8b00b8]/50 transition-all duration-300 overflow-hidden">
                  {/* Hover Gradient Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  {/* Floating Animation */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-4"
                  >
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 sm:w-16 sm:h-16 mb-3 rounded-full bg-gradient-to-br ${category.color} p-3 sm:p-4 shadow-lg`}
                    >
                      <Icon className="w-full h-full text-white" />
                    </motion.div>

                    {/* Category Name */}
                    <h3
                      className="text-foreground text-center text-sm sm:text-base group-hover:text-[#8b00b8] transition-colors duration-300"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {category.name}
                    </h3>
                  </motion.div>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
