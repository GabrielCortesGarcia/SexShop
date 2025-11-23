"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Portal } from "./Portal";
import { Product } from "./AppContext";

interface ProductEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product;
}

export function ProductEditor({ isOpen, onClose, onSave, product }: ProductEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "",
    price: 0,
    image: "",
    badge: "",
    rating: 5,
    description: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
      setSelectedFileName("");
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        image: "",
        badge: "Nuevo",
        rating: 5,
        description: "",
      });
      setSelectedFileName("");
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setSelectedFileName(""); // Clear file name when URL is entered
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es muy grande. Tamaño máximo: 5MB');
        return;
      }

      setSelectedFileName(file.name);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] overflow-y-auto"
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Container */}
            <div className="relative min-h-full flex items-center justify-center p-4 py-8">
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="relative p-6 border-b border-border bg-gradient-to-br from-card to-background">
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-2xl bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
                    >
                      {product ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 hover:bg-muted rounded-full transition-colors duration-300"
                    >
                      <X className="w-6 h-6 text-foreground" />
                    </motion.button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        className="text-sm text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Nombre del Producto
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Vibrador Premium"
                        required
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label
                        className="text-sm text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Categoría
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Vibradores">Vibradores</option>
                        <option value="Aceites">Aceites</option>
                        <option value="Kits">Kits</option>
                        <option value="Ropa Íntima">Ropa Íntima</option>
                        <option value="Juguetes">Juguetes</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <label
                        className="text-sm text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Precio ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        placeholder="0.00"
                        required
                        min="0"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      />
                    </div>

                    {/* Badge */}
                    <div className="space-y-2">
                      <label
                        className="text-sm text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Etiqueta
                      </label>
                      <select
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="Más Vendido">Más Vendido</option>
                        <option value="Recomendado">Recomendado</option>
                        <option value="Oferta">Oferta</option>
                        <option value="Exclusivo">Exclusivo</option>
                      </select>
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                      <label
                        className="text-sm text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Calificación (0-5)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                        required
                        min="0"
                        max="5"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2 md:col-span-2">
                      <label
                        className="text-sm text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Imagen del Producto
                      </label>
                      
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={selectedFileName || formData.image}
                          onChange={(e) => !selectedFileName && handleImageUrlChange(e.target.value)}
                          placeholder={selectedFileName ? selectedFileName : "https://ejemplo.com/imagen.jpg o selecciona un archivo"}
                          readOnly={!!selectedFileName}
                          required
                          className="flex-1 px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleUploadClick}
                          className="px-4 py-3 bg-gradient-to-r from-[#8b00b8]/20 to-[#f6b611]/20 border border-[#8b00b8]/30 rounded-xl hover:from-[#8b00b8]/30 hover:to-[#f6b611]/30 transition-all duration-300 flex items-center gap-2"
                        >
                          <Upload className="w-5 h-5 text-[#8b00b8]" />
                          <span className="text-sm text-[#8b00b8] hidden sm:inline" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                            Seleccionar
                          </span>
                        </motion.button>
                      </div>
                      
                      {selectedFileName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <ImageIcon className="w-4 h-4 text-[#8b00b8]" />
                          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                            Archivo seleccionado: {selectedFileName}
                          </span>
                        </div>
                      )}
                      
                      {formData.image && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2 md:col-span-2">
                      <label
                        className="text-sm text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Descripción
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descripción detallada del producto..."
                        rows={4}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300 resize-none"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 border-2 border-border rounded-xl text-foreground hover:bg-muted transition-all duration-300 text-center"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(139, 0, 184, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white rounded-xl shadow-lg shadow-[#8b00b8]/30 text-center"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                    >
                      {product ? "Guardar Cambios" : "Crear Producto"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
