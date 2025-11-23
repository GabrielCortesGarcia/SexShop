"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "./AppContext";

export function FeaturedProducts() {
  const { products, navigateTo, addToCart } = useApp();

  return (
    <section id="productos" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>
            Productos Destacados
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            Selección exclusiva de productos diseñados para tu placer y bienestar
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-gradient-to-br from-card to-background rounded-2xl overflow-hidden border border-border hover:border-[#8b00b8]/30 transition-all duration-300"
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="inline-block px-3 py-1 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white text-xs rounded-full"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  {product.badge}
                </motion.span>
              </div>

              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-[#8b00b8] text-sm mb-1"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                    {product.category}
                  </p>
                  <h3 className="text-foreground text-xl"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {product.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-[#f6b611] text-[#f6b611]"
                          : "text-[#2A2A2A]"
                      }`}
                    />
                  ))}
                  <span className="text-foreground/70 text-sm ml-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                    {product.rating}
                  </span>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl text-foreground"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                    ${product.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white rounded-full text-sm"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    Añadir
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={() => navigateTo("catalog")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-[#8b00b8]/50 hover:border-[#8b00b8] hover:bg-[#8b00b8]/10 rounded-full text-foreground transition-all duration-300"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
          >
            Ver Todos los Productos
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
