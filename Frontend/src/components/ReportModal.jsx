import React, { useState, useEffect } from 'react';
import ReportButton from './ReportButton';
import ReportFilters from './ReportFilters';

const ReportModal = ({ 
  isOpen, 
  onClose, 
  type = 'audit', 
  title = 'Générer un Rapport',
  className = '',
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);

  // Réinitialiser le state quand la modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
      setGenerationStatus(null);
      setSelectedFormat('pdf');
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleGenerationSuccess = (format, filename) => {
    setGenerationStatus({
      type: 'success',
      message: `Rapport ${format.toUpperCase()} généré avec succès !`,
      filename: filename
    });
    
    // Auto-fermer après 3 secondes
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleGenerationError = (error, format) => {
    setGenerationStatus({
      type: 'error',
      message: `Erreur lors de la génération du rapport ${format.toUpperCase()}: ${error.message}`
    });
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'audit':
        return {
          label: 'Rapport d\'Audit',
          description: 'Génère un rapport détaillé des audits avec les informations de conformité, criticité et plans d\'action.',
          icon: (
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        };
      case 'dashboard':
        return {
          label: 'Rapport Dashboard',
          description: 'Génère un rapport des statistiques et métriques avec les graphiques et indicateurs de performance.',
          icon: (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          )
        };
      case 'reglementation':
        return {
          label: 'Rapport Réglementation',
          description: 'Génère un rapport de la réglementation avec les exigences et leur statut d\'audit.',
          icon: (
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )
        };
      default:
        return {
          label: 'Rapport',
          description: 'Génère un rapport des données sélectionnées.',
          icon: (
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        };
    }
  };

  const typeConfig = getTypeConfig();
  const filterCount = Object.keys(filters).filter(key => filters[key] && filters[key] !== '').length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-200 ${className}`}>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {typeConfig.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">{typeConfig.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
              disabled={isGenerating}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Status bar */}
          {generationStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              generationStatus.type === 'success' 
                ? 'bg-green-100 border border-green-200 text-green-800' 
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {generationStatus.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{generationStatus.message}</span>
              </div>
              {generationStatus.filename && (
                <div className="text-xs mt-1 opacity-75">
                  Fichier: {generationStatus.filename}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6 space-y-6">
            
            {/* Type de rapport */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {typeConfig.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{typeConfig.label}</h3>
                  <p className="text-sm text-gray-700 mt-1">{typeConfig.description}</p>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtres de données
                </h3>
                {filterCount > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {filterCount} filtre{filterCount > 1 ? 's' : ''} actif{filterCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <ReportFilters
                type={type}
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
              />
            </div>

            {/* Format de sortie */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Format de téléchargement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option PDF */}
                <div
                  className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedFormat === 'pdf'
                      ? 'border-red-400 bg-gradient-to-br from-red-50 to-red-100 shadow-lg ring-2 ring-red-200'
                      : 'border-gray-200 hover:border-red-300 hover:shadow-md bg-white hover:bg-red-50'
                  }`}
                  onClick={() => setSelectedFormat('pdf')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl transition-colors duration-200 ${
                      selectedFormat === 'pdf' ? 'bg-red-200' : 'bg-red-100 group-hover:bg-red-200'
                    }`}>
                      <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg transition-colors duration-200 ${
                        selectedFormat === 'pdf' ? 'text-red-800' : 'text-gray-900 group-hover:text-red-800'
                      }`}>
                        Format PDF
                      </h4>
                      <p className={`text-sm mt-1 transition-colors duration-200 ${
                        selectedFormat === 'pdf' ? 'text-red-700' : 'text-gray-600 group-hover:text-red-600'
                      }`}>
                        Document formaté avec mise en page professionnelle
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className={`text-xs transition-colors duration-200 ${
                          selectedFormat === 'pdf' ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'
                        }`}>
                          Idéal pour impression et partage
                        </span>
                      </div>
                    </div>
                    {selectedFormat === 'pdf' && (
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Option Excel */}
                <div
                  className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedFormat === 'excel'
                      ? 'border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-lg ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white hover:bg-green-50'
                  }`}
                  onClick={() => setSelectedFormat('excel')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl transition-colors duration-200 ${
                      selectedFormat === 'excel' ? 'bg-green-200' : 'bg-green-100 group-hover:bg-green-200'
                    }`}>
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm8 0a1 1 0 100 2h6a1 1 0 100-2h-6zm-8 4a1 1 0 100 2h6a1 1 0 100-2H3zm8 0a1 1 0 100 2h6a1 1 0 100-2h-6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg transition-colors duration-200 ${
                        selectedFormat === 'excel' ? 'text-green-800' : 'text-gray-900 group-hover:text-green-800'
                      }`}>
                        Format Excel
                      </h4>
                      <p className={`text-sm mt-1 transition-colors duration-200 ${
                        selectedFormat === 'excel' ? 'text-green-700' : 'text-gray-600 group-hover:text-green-600'
                      }`}>
                        Tableur avec données structurées et calculs
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className={`text-xs transition-colors duration-200 ${
                          selectedFormat === 'excel' ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
                        }`}>
                          Idéal pour analyse et traitement
                        </span>
                      </div>
                    </div>
                    {selectedFormat === 'excel' && (
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations sur le format sélectionné */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    {selectedFormat === 'pdf' ? (
                      <span>
                        Le rapport PDF contiendra une mise en page professionnelle avec graphiques intégrés, 
                        idéal pour la présentation et l'archivage.
                      </span>
                    ) : (
                      <span>
                        Le fichier Excel permettra l'analyse approfondie des données avec formules, 
                        filtres et possibilité de création de graphiques personnalisés.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé des filtres actifs */}
            {filterCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a1 1 0 01-1-1V3a1 1 0 011-1z" />
                  </svg>
                  Filtres appliqués ({filterCount})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters)
                    .filter(([key, value]) => value && value !== '')
                    .map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full border border-amber-300"
                      >
                        <span className="font-semibold">{key}:</span>
                        <span>
                          {typeof value === 'string' && value.length > 30 
                            ? value.substring(0, 30) + '...' 
                            : typeof value === 'object' 
                            ? JSON.stringify(value) 
                            : value
                          }
                        </span>
                      </span>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>
                Le rapport {selectedFormat.toUpperCase()} sera téléchargé automatiquement
                {filterCount > 0 && ` avec ${filterCount} filtre${filterCount > 1 ? 's' : ''} appliqué${filterCount > 1 ? 's' : ''}`}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isGenerating}
                className="px-6 py-2.5 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              
              <ReportButton
                type={type}
                filters={filters}
                variant="primary"
                size="md"
                showDropdown={false}
                onSuccess={handleGenerationSuccess}
                onError={handleGenerationError}
                className="min-w-[180px]"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Génération...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                    </svg>
                    Générer {selectedFormat.toUpperCase()}
                  </>
                )}
              </ReportButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;