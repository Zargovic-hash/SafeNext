import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Accueil", href: "/" },
    { name: "Recap", href: "/recap" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.footer
      className="bg-white border-t border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Contenu principal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo / Nom */}
          <Link to="/" className="text-lg font-semibold text-gray-800">
            SafeNext
          </Link>
          <div className="text-sm text-gray-500">
            &copy; {currentYear} SafeNext. Tous droits réservés.
          </div>

          {/* Liens */}
          <nav className="flex gap-6 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
