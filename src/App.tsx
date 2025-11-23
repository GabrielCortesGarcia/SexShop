import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { CatalogPage } from "./components/CatalogPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppProvider, useApp } from "./components/AppContext";
import { AdminPanel } from "./components/AdminPanel";
import { Toaster } from "./components/ui/sonner";
import { WhatsAppButton } from "./components/WhatsAppButton";

function MainApp() {
  const { user, currentPage, navigateTo, cartItems } = useApp();

  // Si el usuario es admin, mostrar el panel de administración
  if (user?.role === "admin") {
    return <AdminPanel />;
  }

  // Si es la página de checkout, mostrarla sin header
  if (currentPage === "checkout") {
    return <CheckoutPage cartItems={cartItems} onBack={() => navigateTo("home")} />;
  }

  // Si no es admin, mostrar el sitio según la página actual
  return (
    <>
      <Header />
      {currentPage === "home" ? <HomePage /> : <CatalogPage />}
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainApp />
        <Toaster position="bottom-right" />
      </AppProvider>
    </ThemeProvider>
  );
}
