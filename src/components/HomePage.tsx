import { Hero } from "./Hero";
import { FeaturedProducts } from "./FeaturedProducts";
import { Categories } from "./Categories";
import { SafeExperience } from "./SafeExperience";
import { Testimonials } from "./Testimonials";
import { Footer } from "./Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-300">
      <main className="relative">
        <section id="inicio">
          <Hero />
        </section>
        <section id="productos">
          <FeaturedProducts />
        </section>
        <section id="categorias">
          <Categories />
        </section>
        <SafeExperience />
        <section id="testimonios">
          <Testimonials />
        </section>
      </main>
      <section id="contacto">
        <Footer />
      </section>
    </div>
  );
}
