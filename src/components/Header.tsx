"use client";

import { ShoppingCart, Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { CartDrawer } from "./CartDrawer";
import { ProfileModal } from "./ProfileModal";
import { useApp } from "./AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import poppRushLogo from "figma:asset/dd862b63f47110643f8f2b6dd8d67814dd310494.png";

interface MenuItem {
  name: string;
  href: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentPage, navigateTo, cartItems, updateCartQuantity, removeFromCart } = useApp();

  const menuItems: MenuItem[] = [
    { name: "Inicio", href: "#inicio" },
    { name: "Productos", href: "#productos" },
    { name: "Catálogo", href: "catalog" },
    { name: "Testimonios", href: "#testimonios" },
    { name: "Contacto", href: "#contacto" },
  ];

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    
    // Si es navegación a catálogo
    if (href === "catalog") {
      navigateTo("catalog");
      return;
    }
    
    // Si es navegación a home desde otra página
    if (href.startsWith("#") && currentPage !== "home") {
      navigateTo("home");
      // Esperar a que se monte la página antes de hacer scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
      return;
    }
    
    // Navegación normal dentro de la página
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl tracking-wider cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}
          >
            <ImageWithFallback 
              onClick={() => setProfileOpen(true)}
              src={poppRushLogo}
              alt="POPPRUSH Logo"
              className="h-14 w-14 object-cover rounded-full cursor-pointer hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="text-foreground hover:text-[#8b00b8] transition-colors duration-300 cursor-pointer"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setCartOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-white/5 dark:hover:bg-white/5 transition-colors duration-300"
            >
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-white/5 dark:hover:bg-white/5 transition-colors duration-300"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-[#f6b611]" />
              ) : (
                <Moon className="w-6 h-6 text-[#8b00b8]" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="px-4 py-6 space-y-4 relative z-50">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNavClick(item.href);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block w-full text-left text-foreground hover:text-[#8b00b8] active:text-[#8b00b8] transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-[#8b00b8]/10 active:bg-[#8b00b8]/20 cursor-pointer touch-manipulation"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </motion.header>
  );
}