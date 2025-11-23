"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Star, Search, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "./AppContext";
import { toast } from "sonner";

export function AllProducts() {
  const { products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Obtener todas las categorías únicas
  const categories = ["Todas", ...Array.from(new Set(products.map(p => p.category)))];

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} añadido al carrito`, {
      duration: 2000,
      position: "bottom-right",
    });
  };

  return (
    <section id="all-products" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>
            Catálogo Completo
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            Explora nuestra colección completa con filtros por categoría
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder-foreground/40 focus:outline-none focus:border-[#8b00b8] transition-all duration-300"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white shadow-lg shadow-[#8b00b8]/30"
                    : "bg-card border border-border text-foreground hover:border-[#8b00b8]/50"
                }`}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6 text-center"
        >
          <p className="text-foreground/60"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
            Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="group relative bg-gradient-to-br from-card to-background rounded-2xl overflow-hidden border border-border hover:border-[#8b00b8]/30 transition-all duration-300"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + 0.2 }}
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

                  {/* Description */}
                  {product.description && (
                    <p className="text-foreground/60 text-sm line-clamp-2"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                      {product.description}
                    </p>
                  )}

                  {/* Price & Button */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl text-foreground"
                      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                      ${product.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white rounded-full text-sm"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Añadir</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-foreground/60 text-xl"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              No se encontraron productos con los filtros seleccionados
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
