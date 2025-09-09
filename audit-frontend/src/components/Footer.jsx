import React from 'react';
import DocumentIcon from '../icons/DocumentIcon';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <DocumentIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-600 text-sm">
              © 2024 Audit Réglementaire. Tous droits réservés.
            </span>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;