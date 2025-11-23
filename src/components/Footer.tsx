"use client";

import { motion } from "motion/react";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const footerLinks = {
  company: [
    { name: "Sobre Nosotros", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Preguntas Frecuentes", href: "#" },
    { name: "Trabaja con Nosotros", href: "#" },
  ],
  support: [
    { name: "Política de Privacidad", href: "#" },
    { name: "Términos y Condiciones", href: "#" },
    { name: "Política de Envíos", href: "#" },
    { name: "Política de Devoluciones", href: "#" },
  ],
  contact: [
    { icon: Mail, text: "hola@sensual.com" },
    { icon: Phone, text: "+56 5364 6170" },
    { icon: MapPin, text: "Madrid, España" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">
      {/* Animated Background */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(215, 38, 107, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(182, 30, 92, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(215, 38, 107, 0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3
              className="text-3xl tracking-wider bg-gradient-to-r from-[#8b00b8] via-[#f6b611] to-[#e0302f] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
            >
              POPPRUSH
            </h3>
            <p
              className="text-foreground/70 leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
            >
              Tu tienda de confianza para productos de bienestar íntimo. Calidad, discreción y privacidad garantizada.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-card to-background border border-border hover:border-[#8b00b8]/50 flex items-center justify-center group transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-foreground group-hover:text-[#8b00b8] transition-colors duration-300" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4
              className="text-foreground mb-6"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Compañía
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-[#D7266B] transition-colors duration-300 inline-block"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4
              className="text-foreground mb-6"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Legal y Soporte
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-[#D7266B] transition-colors duration-300 inline-block"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4
              className="text-[#0A0A0A] mb-6"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
            >
              Contacto
            </h4>
            <ul className="space-y-4">
              {footerLinks.contact.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-3"
                  >
                    <Icon className="w-5 h-5 text-[#D7266B] mt-0.5 flex-shrink-0" />
                    <span
                      className="text-foreground/70"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                      {contact.text}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-border pt-8 text-center"
        >
          <p
            className="text-foreground/50 text-sm"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
          >
            © 2025 PoppRush. Todos los derechos reservados. Sitio para mayores de 18 años.
          </p>
          <p
            className="text-foreground/30 text-xs mt-2"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
          >
            Diseñado con pasión y respeto por tu privacidad
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
