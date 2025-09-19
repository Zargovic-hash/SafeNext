import React, { useState } from 'react';
import ReportButton from './ReportButton';
import ReportFilters from './ReportFilters';

const ReportModal = ({ 
  isOpen, 
  onClose, 
  type = 'audit', 
  title = 'Générer un Rapport',
  className = '' 
}) => {
  const [filters, setFilters] = useState({});
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  if (!isOpen) return null;

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'audit':
        return 'Rapport d\'Audit';
      case 'dashboard':
        return 'Rapport Dashboard';
      case 'reglementation':
        return 'Rapport Réglementation';
      default:
        return 'Rapport';
    }
  };

  const getTypeDescription = () => {
    switch (type) {
      case 'audit':
        return 'Génère un rapport détaillé des audits avec les informations de conformité, faisabilites et actions.';
      case 'dashboard':
        return 'Génère un rapport des statistiques et métriques du dashboard avec les graphiques et indicateurs.';
      case 'reglementation':
        return 'Génère un rapport de la réglementation avec les exigences et leur statut d\'audit.';
      default:
        return 'Génère un rapport des données sélectionnées.';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{getTypeDescription()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type de rapport */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900">{getTypeLabel()}</h3>
                <p className="text-sm text-blue-700">{getTypeDescription()}</p>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <ReportFilters
            type={type}
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />

          {/* Format de sortie */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Format de sortie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedFormat === 'pdf'
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
                onClick={() => setSelectedFormat('pdf')}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
                    <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">PDF</h4>
                    <p className="text-sm text-gray-600 mt-1">Document formaté avec mise en page professionnelle</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Idéal pour l'impression</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedFormat === 'excel'
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
                onClick={() => setSelectedFormat('excel')}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                    <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm8 0a1 1 0 100 2h6a1 1 0 100-2h-6zm-8 4a1 1 0 100 2h6a1 1 0 100-2H3zm8 0a1 1 0 100 2h6a1 1 0 100-2h-6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Excel</h4>
                    <p className="text-sm text-gray-600 mt-1">Tableur avec données structurées et graphiques</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Idéal pour l'analyse</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé des filtres */}
          {Object.keys(filters).length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">Résumé des filtres</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                  >
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-2xl">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Le rapport sera téléchargé automatiquement une fois généré.
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              Annuler
            </button>
            <ReportButton
              type={type}
              filters={filters}
              variant="primary"
              size="md"
            >
              🚀 Générer {selectedFormat.toUpperCase()}
            </ReportButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
