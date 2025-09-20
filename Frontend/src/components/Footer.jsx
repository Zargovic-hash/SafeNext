import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DocumentIcon from '../icons/DocumentIcon';
import MailIcon from '../icons/MailIcon';
import PhoneIcon from '../icons/PhoneIcon';
import MapPinIcon from '../icons/MapPinIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Fonctionnalités', href: '/features' },
      { name: 'Tarifs', href: '/pricing' },
      { name: 'API', href: '/api' },
      { name: 'Intégrations', href: '/integrations' }
    ],
    company: [
      { name: 'À propos', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Presse', href: '/press' }
    ],
    support: [
      { name: 'Centre d\'aide', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Contact', href: '/contact' },
      { name: 'Statut', href: '/status' }
    ],
    legal: [
      { name: 'Conditions d\'utilisation', href: '/terms' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'RGPD', href: '/gdpr' }
    ]
  };

  return (
    <motion.footer 
      className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="py-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          
          {/* Brand Section */}
          <motion.div 
            className="max-w-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="flex items-center space-x-3 group mb-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <DocumentIcon className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold gradient-text">SafeNext</h3>
                <p className="text-sm text-gray-500">Audit Réglementaire</p>
              </div>
            </Link>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              La plateforme intelligente qui simplifie et centralise l'audit et la gestion 
              de votre conformité réglementaire.
            </p>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MailIcon className="h-4 w-4 text-primary-500" />
                <span>contact@safenext.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-primary-500" />
                <span>+213 557 038 900</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-primary-500" />
                <span>Alger, Algérie</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: 'linkedin', url: 'https://linkedin.com' },
                { icon: 'twitter', url: 'https://twitter.com' },
                { icon: 'github', url: 'https://github.com' }
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                >
                  <i className={`fab fa-${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          <div className="flex flex-wrap gap-10 flex-1 justify-between">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="min-w-[150px]"
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-4 capitalize relative after:content-[''] after:block after:w-6 after:h-0.5 after:bg-primary-500 after:mt-1">
                  {category === 'product' && 'Produit'}
                  {category === 'company' && 'Entreprise'}
                  {category === 'support' && 'Support'}
                  {category === 'legal' && 'Légal'}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-600 hover:text-primary-600 transition-all duration-200 hover:translate-x-1 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="py-6 border-t border-gray-200/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-2">
              <span>© {currentYear} SafeNext. Tous droits réservés.</span>
              <span>•</span>
              <span>Développé par SafeNex</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span>Systèmes opérationnels</span>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded-md">v2.1.0</span>
              <span className="px-2 py-1 bg-gray-100 rounded-md">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
