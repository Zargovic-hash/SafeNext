import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ReportButton = ({ 
  type = 'audit', 
  filters = {}, 
  className = '', 
  variant = 'primary',
  size = 'md',
  children 
}) => {
  const { authenticatedRequest } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFormat, setActiveFormat] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const generateReport = async (format) => {
    setIsGenerating(true);
    setActiveFormat(format);
    setShowDropdown(false);
    
    try {
      // Utiliser fetch directement pour les fichiers binaires
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE}/reports/${format}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          filters
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      // Créer un blob et télécharger le fichier
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      link.download = `rapport_${type}_${timestamp}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('❌ Erreur génération rapport:', error);
      alert(`Erreur lors de la génération du rapport: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setActiveFormat(null);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-xs rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-xl',
      lg: 'px-6 py-3 text-base rounded-xl'
    };
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 focus:ring-blue-500 border border-blue-600/20 shadow-blue-500/25',
      secondary: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 focus:ring-gray-500 border border-gray-600/20 shadow-gray-500/25',
      outline: 'border-2 border-blue-600/80 text-blue-700 hover:bg-blue-50 hover:border-blue-700 focus:ring-blue-500 bg-white/90 backdrop-blur-sm',
      ghost: 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus:ring-blue-500 bg-transparent'
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  return (
    <div className="relative inline-block">
      {/* Container avec design moderne */}
      <div className="flex bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        
        {/* Bouton principal */}
        <button
          className={getButtonClasses() + " rounded-r-none border-r-0"}
          disabled={isGenerating}
          onClick={() => generateReport('pdf')}
        >
          {isGenerating && activeFormat === 'pdf' ? (
            <>
              <div className="relative">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <span className="animate-pulse font-medium">Génération PDF...</span>
            </>
          ) : isGenerating && activeFormat === 'excel' ? (
            <>
              <div className="relative">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <span className="animate-pulse font-medium">Génération Excel...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{children || 'Générer Rapport'}</span>
            </>
          )}
        </button>
        
        {/* Séparateur visuel */}
        <div className="w-px bg-gradient-to-b from-transparent via-white/30 to-transparent self-stretch"></div>
        
        {/* Bouton dropdown */}
        <button
          className="px-3 py-2.5 text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset disabled:opacity-50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-l-none"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isGenerating}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''} ${isGenerating ? 'opacity-50' : 'hover:scale-110'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Menu dropdown amélioré */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5 focus:outline-none z-50 border border-gray-200/60 overflow-hidden">
          <div className="p-2">
            {/* En-tête du dropdown */}
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-2">
              Choisir le format
            </div>
            
            {/* Option PDF */}
            <button
              className="w-full flex items-center gap-4 px-3 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-800 cursor-pointer transition-all duration-200 rounded-xl group"
              onClick={() => generateReport('pdf')}
              disabled={isGenerating}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-xl transition-colors duration-200">
                <svg className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Rapport PDF</div>
                <div className="text-xs text-gray-500 group-hover:text-red-600">Document formaté pour impression</div>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Option Excel */}
            <button
              className="w-full flex items-center gap-4 px-3 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-800 cursor-pointer transition-all duration-200 rounded-xl group"
              onClick={() => generateReport('excel')}
              disabled={isGenerating}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-xl transition-colors duration-200">
                <svg className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm8 0a1 1 0 100 2h6a1 1 0 100-2h-6zm-8 4a1 1 0 100 2h6a1 1 0 100-2H3zm8 0a1 1 0 100 2h6a1 1 0 100-2h-6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Fichier Excel</div>
                <div className="text-xs text-gray-500 group-hover:text-green-600">Tableur structuré pour analyse</div>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 opacity-0 group-hover:opacity-100 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Footer informatif */}
          <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center">
              Les rapports incluent tous les filtres appliqués
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay pour fermer le dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default ReportButton;