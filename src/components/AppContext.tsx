"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  rating: number;
  description?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface User {
  email: string;
  role: "admin" | "user";
  name: string;
}

export type PageType = "home" | "catalog" | "checkout";

interface AppContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  user: User | null;
  login: (email: string, password: string, isAdmin?: boolean) => boolean;
  logout: () => void;
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Esencia Sensual",
    category: "Aceites",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1630332159758-c02a3accc8fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MDU0MzMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Nuevo",
    rating: 4.8,
    description: "Aceite de masaje sensual con aroma exquisito para momentos especiales"
  },
  {
    id: 2,
    name: "Vibrador Discreto",
    category: "Vibradores",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1739950839930-ef45c078f316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWxsbmVzcyUyMHByb2R1Y3R8ZW58MXx8fHwxNzYwNTQ0MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Más Vendido",
    rating: 4.9,
    description: "Vibrador compacto y silencioso, ideal para principiantes"
  },
  {
    id: 3,
    name: "Kit Parejas",
    category: "Kits",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWluaW1hbCUyMGNvc21ldGljc3xlbnwxfHx8fDE3NjA1NDQxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Recomendado",
    rating: 5.0,
    description: "Kit completo para parejas que buscan explorar nuevas experiencias"
  },
  {
    id: 4,
    name: "Lencería Premium",
    category: "Ropa Íntima",
    price: 65.99,
    image: "https://images.unsplash.com/photo-1672664003230-d32f42c34650?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbHV4dXJ5JTIwbGlmZXN0eWxlfGVufDF8fHx8MTc2MDU0NDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Nuevo",
    rating: 4.7,
    description: "Lencería de alta calidad con diseño exclusivo y materiales suaves"
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  // El carrito siempre inicia vacío
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const login = (email: string, password: string, isAdmin = false): boolean => {
    // Credenciales de admin
    if (isAdmin && email === "admin@sexshop.com" && password === "admin123") {
      setUser({
        email,
        role: "admin",
        name: "Administrador"
      });
      return true;
    }
    
    // Login de usuario normal (simulado)
    if (!isAdmin && email && password) {
      setUser({
        email,
        role: "user",
        name: email.split("@")[0]
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    // Scroll to top cuando cambiamos de página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`${product.name} agregado al carrito`, {
        description: `Cantidad: ${existingItem.quantity + 1}`,
      });
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
      }]);
      toast.success(`${product.name} agregado al carrito`, {
        description: 'Cantidad: 1',
      });
    }
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        user,
        login,
        logout,
        currentPage,
        navigateTo,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
