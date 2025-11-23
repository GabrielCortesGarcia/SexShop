"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useApp } from "./AppContext";
import { 
  ShoppingBag, 
  Package, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  Lock,
  Plus,
  Minus,
  Trash2,
  MessageCircle
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

// Base de datos simulada de códigos postales
const postalCodeDatabase: Record<string, { city: string; state: string; country: string }> = {
  // Ciudad de México
  "01000": { city: "Ciudad de México", state: "CDMX", country: "México" },
  // Guadalajara
  "44100": { city: "Guadalajara", state: "Jalisco", country: "México" },
  // Monterrey
  "64000": { city: "Monterrey", state: "Nuevo León", country: "México" },
  // Puebla
  "72000": { city: "Puebla", state: "Puebla", country: "México" },
  // Querétaro
  "76000": { city: "Querétaro", state: "Querétaro", country: "México" },
  // Cancún
  "77500": { city: "Cancún", state: "Quintana Roo", country: "México" },
  // Tijuana
  "22000": { city: "Tijuana", state: "Baja California", country: "México" },
  "22010": { city: "Tijuana", state: "Baja California", country: "México" },
  // Mérida
  "97000": { city: "Mérida", state: "Yucatán", country: "México" },
};

function lookupPostalCode(zipCode: string): { city: string; state: string; country: string } | null {
  return postalCodeDatabase[zipCode] || null;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface ShippingData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
}

export function CheckoutPage({ cartItems, onBack }: CheckoutPageProps) {
  const { navigateTo, updateCartQuantity, removeFromCart, clearCart } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Auto-completar ciudad, estado y país cuando se ingresa el código postal
  useEffect(() => {
    if (shippingData.zipCode.length === 5) {
      const locationData = lookupPostalCode(shippingData.zipCode);
      if (locationData) {
        setShippingData(prev => ({
          ...prev,
          city: locationData.city,
          state: locationData.state,
          country: locationData.country,
        }));
        toast.success(`Ubicación detectada: ${locationData.city}, ${locationData.state}`);
      } else {
        toast.error("Código postal no encontrado. Ingresa uno válido de México.");
        setShippingData(prev => ({
          ...prev,
          city: "",
          state: "",
          country: "",
        }));
      }
    }
  }, [shippingData.zipCode]);

  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const brickContainerId = "cardPaymentBrick_container";
  const [isBrickReady, setIsBrickReady] = useState(false);
  const bricksInstance = useRef<any>(null);
  const cardBrick = useRef<any>(null);
  
  // Estados de validación
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 300.00;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  const steps = [
    { number: 1, title: "Resumen", icon: ShoppingBag },
    { number: 2, title: "Envío", icon: Package },
    { number: 3, title: "Pago", icon: CreditCard },
  ];

  const createPayment = async (cardFormData: any) => {
    try {
      setIsProcessing(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionAmount: total,
            token: cardFormData.token,
            description: "Compra en SexShop",
            installments: cardFormData.installments,
            paymentMethodId: cardFormData.payment_method_id,
            issuerId: cardFormData.issuer_id,
            email: cardFormData.payer.email,
            identificationType: cardFormData.payer.identification?.type,
            identificationNumber: cardFormData.payer.identification?.number,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Error en pago:", data);
        toast.error("Ocurrió un error al procesar el pago");
        setIsProcessing(false);
        return;
      }

      const orderDetails = `
DETALLES DE TU COMPRA:
${cartItems.map(item => `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

RESUMEN:
Subtotal: $${subtotal.toFixed(2)}
Envío: $${shipping.toFixed(2)}
IVA: $${tax.toFixed(2)}
Total: $${total.toFixed(2)}

DIRECCIÓN DE ENVÍO:
${shippingData.fullName}
${shippingData.address}
${shippingData.city}, ${shippingData.state}, ${shippingData.zipCode}
${shippingData.country}
Tel: ${shippingData.phone}

MÉTODO DE PAGO:
Pago procesado mediante Mercado Pago
      `.trim();

      if (sendWhatsApp) {
        toast.success("📱 Confirmación enviada por WhatsApp");
        console.log("WhatsApp Message:", orderDetails);
      }

      if (sendEmail) {
        toast.success("📧 Confirmación enviada por correo electrónico");
        console.log("Email to:", shippingData.email);
        console.log("Email Content:", orderDetails);
      }

      if (!sendWhatsApp && !sendEmail) {
        toast.success("¡Pedido realizado con éxito! Gracias por tu compra.");
      } else {
        toast.success("¡Pedido realizado con éxito! Revisa tus notificaciones.");
      }

      clearCart();
      setTimeout(() => {
        navigateTo("home");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al procesar el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
  if (typeof window === "undefined") return;
  if (currentStep !== 3) return;

  const w = window as any;
  if (!w.MercadoPago) return;

  const mp = new w.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
    locale: "es-MX",
  });

  const bricksBuilder = mp.bricks();
    bricksInstance.current = bricksBuilder;

    const renderCardBrick = async () => {
      setIsBrickReady(false);
      if (cardBrick.current) {
        await cardBrick.current.destroy();
      }

      const settings = {
        initialization: {
          amount: total,
        },
        callbacks: {
          onSubmit: async (cardFormData: any) => {
            await createPayment(cardFormData);
            return;
          },
          onReady: () => {
            setIsBrickReady(true);
          },
          onError: (error: any) => {
            console.error(error);
            toast.error("Error en el formulario de pago");
          },
        },
      };

      cardBrick.current = await bricksBuilder.create(
        "cardPayment",
        brickContainerId,
        settings
      );
    };

    renderCardBrick();

    return () => {
      if (cardBrick.current) {
        cardBrick.current.destroy();
      }
    };
  }, [currentStep, total]);


  const handleContinue = () => {
    if (currentStep === 1) {
      if (cartItems.length === 0) {
        toast.error("Tu carrito está vacío");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validar datos de envío
      if (!shippingData.fullName || !shippingData.email || !shippingData.phone || 
          !shippingData.address || !shippingData.city || !shippingData.state || 
          !shippingData.zipCode) {
        toast.error("Por favor completa todos los campos de envío");
        return;
      }
      
      // Validar correo electrónico
      if (!shippingData.email.includes('@') || !shippingData.email.includes('.')) {
        setEmailError("El correo debe contener @ y un punto (.)");
        toast.error("Por favor ingresa un correo electrónico válido");
        return;
      }
      
      // Validar teléfono (10 dígitos numéricos)
      const phoneDigits = shippingData.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        setPhoneError("El teléfono debe tener exactamente 10 dígitos");
        toast.error("El teléfono debe tener exactamente 10 dígitos");
        return;
      }
      
      setEmailError("");
      setPhoneError("");
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-8">
              {/* Animated Spinner */}
              <div className="relative w-24 h-24">
                {/* Outer ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#8b00b8] border-r-[#8b00b8]"
                />
                {/* Middle ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#f6b611] border-l-[#f6b611]"
                />
                {/* Inner ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-4 border-transparent border-t-[#8b00b8]/50 border-r-[#f6b611]/50"
                />
                {/* Center pulse */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-8 rounded-full bg-gradient-to-br from-[#8b00b8] to-[#f6b611]"
                />
              </div>

              {/* Processing Text */}
              <div className="text-center space-y-2">
                <motion.h3
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl bg-gradient-to-r from-[#8b00b8] via-[#f6b611] to-[#8b00b8] bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                >
                  Procesando tu pago
                </motion.h3>
                <motion.div className="flex items-center justify-center gap-1">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-[#8b00b8]"
                  />
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-[#f6b611]"
                  />
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-[#8b00b8]"
                  />
                </motion.div>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  Por favor espera un momento...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-foreground hover:text-[#8b00b8] transition-colors duration-300"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </motion.button>
            
            <h1
              className="text-xl sm:text-2xl bg-gradient-to-r from-foreground via-[#8b00b8] to-foreground bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
            >
              Checkout
            </h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  animate={{
                    scale: currentStep === step.number ? 1.1 : 1,
                    backgroundColor: currentStep >= step.number ? "#8b00b8" : "transparent",
                  }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center ${
                    currentStep >= step.number 
                      ? "border-[#8b00b8] text-white" 
                      : "border-border text-muted-foreground"
                  } transition-colors duration-300`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </motion.div>
                <p
                  className={`mt-2 text-xs sm:text-sm ${
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-border mx-2 sm:mx-4 relative -top-5">
                  <motion.div
                    animate={{
                      width: currentStep > step.number ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-[#8b00b8]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Resumen */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2
                    className="text-2xl text-foreground mb-6"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                  >
                    Resumen del Pedido
                  </h2>
                  
                  {cartItems.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p
                        className="text-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        Tu carrito está vacío
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
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
                            
                            {/* Price and Quantity Controls */}
                            <div className="flex items-center justify-between gap-4">
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
                                    updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
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
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 rounded-lg bg-muted hover:bg-[#8b00b8] hover:text-white flex items-center justify-center transition-all duration-300 border border-border"
                                >
                                  <Plus className="w-3 h-3" />
                                </motion.button>
                              </div>
                            </div>
                            
                            {/* Subtotal */}
                            <div className="mt-2">
                              <span
                                className="text-xs text-muted-foreground"
                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                              >
                                Subtotal:{" "}
                              </span>
                              <span
                                className="text-sm text-foreground"
                                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                              >
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success(`${item.name} eliminado del carrito`);
                            }}
                            className="p-2 hover:bg-destructive/10 rounded-full transition-colors duration-300 self-start"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Envío */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2
                    className="text-2xl text-foreground mb-6"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                  >
                    Información de Envío
                  </h2>
                  
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    {/* Nombre completo */}
                    <div className="space-y-2">
                      <label
                        className="text-sm text-foreground flex items-center gap-2"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        <UserIcon className="w-4 h-4 text-[#8b00b8]" />
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={shippingData.fullName}
                        onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                        placeholder="Juan Pérez"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      />
                    </div>
                  </div>

                    {/* Email y Teléfono */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm text-foreground flex items-center gap-2"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                        >
                          <Mail className="w-4 h-4 text-[#8b00b8]" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => {
                            setShippingData({ ...shippingData, email: e.target.value });
                            setEmailError("");
                          }}
                          onBlur={() => {
                            const email = shippingData.email.trim();
                            if (email.length > 0) {
                              if (!email.includes('@') || !email.includes('.')) {
                                setEmailError("El correo debe contener @ y un punto (.)");
                              } else if (email.indexOf('@') > email.lastIndexOf('.')) {
                                setEmailError("El punto debe ir después del @");
                              } else {
                                setEmailError("");
                              }
                            }
                          }}
                          placeholder="tu@email.com"
                          className={`w-full px-4 py-3 bg-input-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-300 ${
                            emailError 
                              ? 'border-[#e0302f] focus:border-[#e0302f] focus:ring-[#e0302f]/20' 
                              : 'border-border focus:border-[#8b00b8] focus:ring-[#8b00b8]/20'
                          }`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        />
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[#e0302f] flex items-center gap-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                          >
                            ⚠️ {emailError}
                          </motion.p>
                        )}
                        {shippingData.email.includes('@') && 
                         shippingData.email.includes('.') && 
                         shippingData.email.indexOf('@') < shippingData.email.lastIndexOf('.') &&
                         !emailError && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[#8b00b8] flex items-center gap-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                          >
                            ✓ Correo válido
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm text-foreground flex items-center gap-2"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                        >
                          <Phone className="w-4 h-4 text-[#8b00b8]" />
                          Teléfono (10 dígitos)
                        </label>
                        <input
                          type="tel"
                          value={shippingData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              // Formato: XXX-XXX-XXXX
                              let formatted = value;
                              if (value.length > 6) {
                                formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
                              } else if (value.length > 3) {
                                formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
                              }
                              setShippingData({ ...shippingData, phone: formatted });
                              setPhoneError("");
                            }
                          }}
                          onBlur={() => {
                            const digits = shippingData.phone.replace(/\D/g, '');
                            if (digits.length > 0 && digits.length !== 10) {
                              setPhoneError("El teléfono debe tener exactamente 10 dígitos");
                            } else {
                              setPhoneError("");
                            }
                          }}
                          placeholder="555-123-4567"
                          maxLength={12}
                          className={`w-full px-4 py-3 bg-input-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-300 ${
                            phoneError 
                              ? 'border-[#e0302f] focus:border-[#e0302f] focus:ring-[#e0302f]/20' 
                              : 'border-border focus:border-[#8b00b8] focus:ring-[#8b00b8]/20'
                          }`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        />
                        {phoneError && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[#e0302f] flex items-center gap-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                          >
                            ⚠️ {phoneError}
                          </motion.p>
                        )}
                        {shippingData.phone.replace(/\D/g, '').length === 10 && !phoneError && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[#8b00b8] flex items-center gap-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                          >
                            ✓ Teléfono válido
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Código Postal - Primero para autocompletar */}
                    <div className="space-y-2">
                      <label
                        className="text-sm text-foreground flex items-center gap-2"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                      >
                        <MapPin className="w-4 h-4 text-[#8b00b8]" />
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={shippingData.zipCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 5) {
                            setShippingData({ ...shippingData, zipCode: value });
                          }
                        }}
                        placeholder="01000"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8b00b8] focus:ring-2 focus:ring-[#8b00b8]/20 transition-all duration-300"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      />
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        Ingresa tu código postal para autocompletar ciudad, estado y país
                      </p>
                    </div>

                    {/* Ciudad, Estado, País - Autocompletados y solo lectura */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm text-foreground"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                        >
                          Ciudad
                        </label>
                        <input
                          type="text"
                          value={shippingData.city}
                          readOnly
                          placeholder="Auto-completado"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm text-foreground"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                        >
                          Estado
                        </label>
                        <input
                          type="text"
                          value={shippingData.state}
                          readOnly
                          placeholder="Auto-completado"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        />
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <p
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                    >
                      Tus datos de pago se procesan de forma segura a través de Mercado Pago.
                    </p>

                    {!isBrickReady && (
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                      >
                        Cargando formulario de pago...
                      </p>
                    )}

                    <div id={brickContainerId} />

                    {/* Opciones de confirmación */}
                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                      <h3
                        className="text-foreground"
                        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                      >
                        Recibir confirmación de compra
                      </h3>

                      {/* WhatsApp Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={sendWhatsApp}
                            onChange={(e) => setSendWhatsApp(e.target.checked)}
                            className="peer w-5 h-5 rounded border-2 border-border appearance-none cursor-pointer transition-all checked:bg-[#8b00b8] checked:border-[#8b00b8] hover:border-[#8b00b8]"
                          />
                          <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span
                              className="text-foreground group-hover:text-[#8b00b8] transition-colors"
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                            >
                              Enviar confirmación mediante WhatsApp
                            </span>
                          </div>
                          <p
                            className="text-xs text-muted-foreground mt-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                          >
                            Recibirás los detalles de tu compra en el {shippingData.phone || "número registrado"}
                          </p>
                        </div>
                      </label>

                      {/* Email Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="peer w-5 h-5 rounded border-2 border-border appearance-none cursor-pointer transition-all checked:bg-[#8b00b8] checked:border-[#8b00b8] hover:border-[#8b00b8]"
                          />
                          <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#f6b611]" />
                            <span
                              className="text-foreground group-hover:text-[#8b00b8] transition-colors"
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                            >
                              Enviar confirmación mediante correo
                            </span>
                          </div>
                          <p
                            className="text-xs text-muted-foreground mt-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                          >
                            Recibirás los detalles de tu compra en {shippingData.email || "tu correo electrónico"}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={sendWhatsApp}
                            onChange={(e) => setSendWhatsApp(e.target.checked)}
                            className="peer w-5 h-5 rounded border-2 border-border appearance-none cursor-pointer transition-all checked:bg-[#8b00b8] checked:border-[#8b00b8] hover:border-[#8b00b8]"
                          />
                          <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span
                              className="text-foreground group-hover:text-[#8b00b8] transition-colors"
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                            >
                              Enviar confirmación mediante WhatsApp
                            </span>
                          </div>
                          <p
                            className="text-xs text-muted-foreground mt-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                          >
                            Recibirás los detalles de tu compra en el {shippingData.phone || "número registrado"}
                          </p>
                        </div>
                      {/* Email Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="peer w-5 h-5 rounded border-2 border-border appearance-none cursor-pointer transition-all checked:bg-[#8b00b8] checked:border-[#8b00b8] hover:border-[#8b00b8]"
                          />
                          <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#f6b611]" />
                            <span
                              className="text-foreground group-hover:text-[#8b00b8] transition-colors"
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                            >
                              Enviar confirmación mediante correo
                            </span>
                          </div>
                          <p
                            className="text-xs text-muted-foreground mt-1"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                          >
                            Recibirás los detalles de tu compra en {shippingData.email || "tu correo electrónico"}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-4">
              <h3
                className="text-lg text-foreground mb-4"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
              >
                Resumen
              </h3>

              <div className="space-y-3 py-3 border-b border-border">
                <div className="flex justify-between">
                  <span
                    className="text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className="text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    Envío
                  </span>
                  <span
                    className="text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className="text-muted-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    IVA (16%)
                  </span>
                  <span
                    className="text-foreground"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3">
                <span
                  className="text-foreground"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                >
                  Total
                </span>
                <span
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>

              {currentStep !== 3 && (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(139, 0, 184, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  className="w-full py-4 bg-gradient-to-r from-[#8b00b8] to-[#ff007f] text-white rounded-2xl shadow-lg shadow-[#8b00b8]/30 flex items-center justify-center gap-2"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              {currentStep === 3 && (
                <p
                  className="text-center text-xs text-muted-foreground mt-3"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                >
                  Al completar el pedido, aceptas nuestros términos y condiciones
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}