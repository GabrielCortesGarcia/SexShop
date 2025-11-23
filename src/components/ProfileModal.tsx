"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Portal } from "./Portal";
import { useApp } from "./AppContext";
import { toast } from "sonner";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Detectar automáticamente si son credenciales de admin
    const isAdminMode = formData.email === "admin@sexshop.com" && formData.password === "admin123";
    
    const success = login(formData.email, formData.password, isAdminMode);
    
    if (success) {
      if (isAdminMode) {
        toast.success("¡Bienvenido Administrador! Accediendo al panel...");
      } else {
        toast.success("¡Sesión iniciada correctamente!");
      }
      onClose();
      // Reset form
      setFormData({ name: "", email: "", password: "" });
    } else {
      setError(isAdminMode 
        ? "Credenciales de administrador incorrectas. Usa: admin@sexshop.com / admin123" 
        : "Email o contraseña incorrectos"
      );
    }
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
          
          {/* Container for centering */}
          <div className="relative min-h-full flex items-center justify-center p-4 py-8">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-4 sm:p-6 border-b border-border bg-gradient-to-br from-card to-background">
                <div className="flex items-center justify-between mb-2">
                  <h2
                    className="text-xl sm:text-2xl bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
                  >
                    {isLogin ? "Bienvenido" : "Crear Cuenta"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-full transition-colors duration-300 flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  </motion.button>
                </div>
                <p
                  className="text-sm sm:text-base text-muted-foreground"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  {isLogin
                    ? "Ingresa a tu cuenta para continuar"
                    : "Únete a nuestra comunidad"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {/* Name Field (Register only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label
                      className="text-sm text-foreground"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      Nombre completo
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Tu nombre"
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    className="text-sm text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="tu@email.com"
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    className="text-sm text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password (Login only) */}
                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-[#8b00b8] hover:underline"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p
                      className="text-sm text-red-500"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                    >
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(139, 0, 184, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-2.5 sm:py-3 text-sm sm:text-base text-center bg-gradient-to-r from-[#8b00b8] to-[#f6b611] text-white rounded-xl shadow-lg shadow-[#8b00b8]/30"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                </motion.button>

                {/* Admin Credentials (Login only) */}
                {isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-[#8b00b8]/10 border border-[#8b00b8]/30 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b00b8] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p
                        className="text-xs sm:text-sm text-[#8b00b8]"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                      >
                        Credenciales de Administrador:
                      </p>
                      <p
                        className="text-xs text-[#8b00b8]/80"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        Email: admin@sexshop.com
                      </p>
                      <p
                        className="text-xs text-[#8b00b8]/80"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        Contraseña: admin123
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Toggle Login/Register */}
                <div className="text-center pt-4 border-t border-border">
                  <p
                    className="text-xs sm:text-sm text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[#8b00b8] hover:underline font-semibold"
                    >
                      {isLogin ? "Regístrate" : "Inicia sesión"}
                    </button>
                  </p>
                </div>

                {/* Privacy Notice */}
                <p
                  className="text-[10px] sm:text-xs text-center text-muted-foreground pt-2 leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  Al continuar, aceptas nuestros{" "}
                  <span className="text-[#8b00b8] hover:underline cursor-pointer">Términos y Condiciones</span> y{" "}
                  <span className="text-[#8b00b8] hover:underline cursor-pointer">Política de Privacidad</span>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
