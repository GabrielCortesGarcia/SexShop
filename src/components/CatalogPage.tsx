import { AllProducts } from "./AllProducts";
import { Footer } from "./Footer";

export function CatalogPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-300">
      <main className="relative pt-20">
        <AllProducts />
      </main>
      <Footer />
    </div>
  );
}
