"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Portal } from "./Portal";
import { useApp } from "./AppContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const { navigateTo } = useApp();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigateTo("checkout");
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-background border-l border-border shadow-2xl z-[9999] flex flex-col"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b00b8] to-[#f6b611] flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2
                    className="text-xl text-foreground"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                  >
                    Mi Carrito
                  </h2>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {itemCount} {itemCount === 1 ? "producto" : "productos"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors duration-300"
              >
                <X className="w-6 h-6 text-foreground" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-background">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div>
                    <h3
                      className="text-lg text-foreground mb-2"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                    >
                      Tu carrito está vacío
                    </h3>
                    <p
                      className="text-muted-foreground"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                    >
                      Agrega productos para comenzar tu compra
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClose();
                      navigateTo("catalog");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white rounded-full mt-4"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                  >
                    Explorar Productos
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-[#8b00b8]/50 hover:shadow-md transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 ring-1 ring-border">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[#8b00b8] text-xs mb-1"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                        >
                          {item.category}
                        </p>
                        <h4
                          className="text-foreground mb-2 truncate text-sm"
                          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                        >
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className="text-base text-foreground"
                            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                          >
                            ${item.price.toFixed(2)}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                              }
                              className="w-7 h-7 rounded-lg bg-muted hover:bg-[#8b00b8] hover:text-white flex items-center justify-center transition-all duration-300 border border-border"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span
                              className="w-10 text-center text-foreground text-sm"
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                            >
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-muted hover:bg-[#8b00b8] hover:text-white flex items-center justify-center transition-all duration-300 border border-border"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 hover:bg-destructive/10 rounded-full transition-colors duration-300 self-start"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4 bg-card">
                {/* Subtotal */}
                <div className="flex items-center justify-between py-2">
                  <span
                    className="text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="text-2xl text-foreground"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(215, 38, 107, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white rounded-xl shadow-lg shadow-[#8b00b8]/30 flex items-center justify-center"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  Proceder al Pago
                </motion.button>

                <p
                  className="text-center text-xs text-muted-foreground"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  Envío calculado en el checkout
                </p>
              </div>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
