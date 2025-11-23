"use client";

import { motion } from "motion/react";
import { Edit, Trash2, Plus, LogOut, Package, Filter, Star, DollarSign } from "lucide-react";
import { useState, useMemo } from "react";
import { useApp, Product } from "./AppContext";
import { ProductEditor } from "./ProductEditor";
import { toast } from "sonner";

export function AdminPanel() {
  const { products, updateProduct, deleteProduct, addProduct, logout, user } = useApp();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("");

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsEditorOpen(true);
  };

  const handleSave = (productData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success("Producto actualizado correctamente");
    } else {
      addProduct(productData as Omit<Product, "id">);
      toast.success("Producto creado correctamente");
    }
  };

  const handleDelete = (id: number) => {
    const product = products.find(p => p.id === id);
    if (confirm(`¿Estás seguro de que deseas eliminar "${product?.name}"?`)) {
      deleteProduct(id);
      toast.success("Producto eliminado correctamente");
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      
      // Price range filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(p => parseFloat(p));
        if (max) {
          if (product.price < min || product.price > max) {
            return false;
          }
        } else {
          // For "501+" case
          if (product.price < min) {
            return false;
          }
        }
      }
      
      // Rating filter
      if (minRating && product.rating < parseFloat(minRating)) {
        return false;
      }
      
      return true;
    });
  }, [products, selectedCategory, priceRange, minRating]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category))).sort();
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-card to-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-[#8b00b8]/20 to-[#f6b611]/20 rounded-xl">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-[#8b00b8]" />
              </div>
              <div>
                <h1
                  className="text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
                >
                  Panel de Administración
                </h1>
                <p
                  className="text-sm text-muted-foreground mt-0.5 sm:mt-1"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  Bienvenido, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreate}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white rounded-xl shadow-lg shadow-[#8b00b8]/30 flex items-center justify-center gap-2"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Nuevo Producto</span>
                <span className="sm:hidden">Nuevo</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-border hover:bg-muted rounded-xl transition-all duration-300 flex items-center gap-2 text-foreground"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-background border border-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-[#8b00b8]" />
              <label
                className="text-foreground"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
              >
                Categoría
              </label>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </motion.div>

          {/* Price Range Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-card to-background border border-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-[#8b00b8]" />
              <label
                className="text-foreground"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
              >
                Rango de Precio
              </label>
            </div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              <option value="all">Todos los precios</option>
              <option value="0-100">$0 - $100</option>
              <option value="101-200">$101 - $200</option>
              <option value="201-300">$201 - $300</option>
              <option value="301-500">$301 - $500</option>
              <option value="501">$501+</option>
            </select>
          </motion.div>

          {/* Rating Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-card to-background border border-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-[#8b00b8]" />
              <label
                className="text-foreground"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
              >
                Rating Mínimo
              </label>
            </div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              <option value="">Todos los ratings</option>
              <option value="4.5">4.5+ ⭐</option>
              <option value="4">4+ ⭐</option>
              <option value="3.5">3.5+ ⭐</option>
              <option value="3">3+ ⭐</option>
              <option value="2.5">2.5+ ⭐</option>
              <option value="2">2+ ⭐</option>
              <option value="1">1+ ⭐</option>
            </select>
          </motion.div>
        </div>

        {/* Products Table - Desktop View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block bg-gradient-to-br from-card to-background border border-border rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2
              className="text-2xl text-foreground"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
            >
              Productos
            </h2>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    Imagen
                  </th>
                  <th
                    className="px-6 py-4 text-left text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    Nombre
                  </th>
                  <th
                    className="px-6 py-4 text-left text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    Categoría
                  </th>
                  <th
                    className="px-6 py-4 text-left text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    Precio
                  </th>
                  <th
                    className="px-6 py-4 text-left text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    Etiqueta
                  </th>
                  <th
                    className="px-6 py-4 text-left text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    Rating
                  </th>
                  <th
                    className="px-6 py-4 text-right text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p
                        className="text-muted-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        No se encontraron productos con los filtros seleccionados
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/30 transition-colors duration-200"
                    >
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        {product.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#8b00b8]/10 text-[#8b00b8] rounded-full text-sm"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-foreground"
                        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                      >
                        ${product.price}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#8b00b8]/20 to-[#f6b611]/20 text-foreground rounded-full text-sm"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                        {product.badge}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        {product.rating} ⭐
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-[#8b00b8]/10 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-5 h-5 text-[#8b00b8]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Product Editor Modal */}
      <ProductEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}
