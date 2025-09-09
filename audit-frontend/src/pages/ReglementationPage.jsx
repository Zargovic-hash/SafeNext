import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import Badge from '../components/ui/Badge';
import SearchIcon from '../icons/SearchIcon';
import DocumentIcon from '../icons/DocumentIcon';
import XIcon from '../icons/XIcon';
import Sidebar from '../components/Sidebar';

// Composants manquants créés dans l'esprit shadcn/ui
const GridIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const TableIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const CheckCircleIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const EmptyStateIcon = ({ className = "h-16 w-16" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
  );
};

const StatusBadge = ({ status, children, ...props }) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    danger: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    neutral: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-150 ${variants[status] || variants.neutral}`} {...props}>
      {children}
    </span>
  );
};

const ReglementationPage = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [auditingRegulation, setAuditingRegulation] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const { token } = useAuth();

  const API_BASE = 'http://localhost:3001/api';

  // Charger les réglementations
  useEffect(() => {
    const fetchRegulations = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/reglementation`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setRegulations(data);

      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegulations();
  }, [token]);

  // Filtrer les données
  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = !searchTerm || 
      reg.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.exigence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.domaine?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomaine = !selectedDomaine || reg.domaine === selectedDomaine;
    
    return matchesSearch && matchesDomaine;
  });

  // Obtenir la liste unique des domaines
  const domaines = [...new Set(regulations.map(reg => reg.domaine).filter(Boolean))].sort();

  // Grouper par domaine pour l'affichage
  const groupedRegulations = filteredRegulations.reduce((acc, reg) => {
    const domaine = reg.domaine || 'Non défini';
    if (!acc[domaine]) {
      acc[domaine] = [];
    }
    acc[domaine].push(reg);
    return acc;
  }, {});

  const handleStartAudit = (regulation) => {
    setAuditingRegulation(regulation);
    setShowAuditModal(true);
  };

  // Loading state amélioré
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="flex h-screen">
          {/* Sidebar skeleton */}
          <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/60 animate-pulse hidden md:block">
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main loading content */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="relative">
                <LoadingSpinner size="lg" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 opacity-50"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Chargement des réglementations</h3>
                <p className="text-sm text-gray-600">Veuillez patienter...</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Error state amélioré
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-lg mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12 px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <AlertCircleIcon className="h-10 w-10 text-red-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex h-screen">
        {/* Sidebar améliorée */}
        <Sidebar
          domaines={domaines}
          selectedDomaine={selectedDomaine}
          onDomaineChange={setSelectedDomaine}
          className="hidden md:block bg-white/80 backdrop-blur-sm border-r border-gray-200/60"
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header amélioré */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-6 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Réglementations
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 mt-2 flex items-center space-x-2"
                >
                  <span className="flex items-center space-x-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${filteredRegulations.length > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                    <span className="font-medium">{filteredRegulations.length}</span>
                    <span>réglementation{filteredRegulations.length > 1 ? 's' : ''}</span>
                  </span>
                  {selectedDomaine && (
                    <>
                      <span className="text-gray-400">•</span>
                      <StatusBadge status="info">{selectedDomaine}</StatusBadge>
                    </>
                  )}
                </motion.p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                {/* Barre de recherche améliorée */}
                <div className="relative flex-1 sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Rechercher par titre, exigence ou domaine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Toggle view mode amélioré */}
                <div className="flex bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      viewMode === 'cards'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <GridIcon className="h-4 w-4" />
                    <span>Cartes</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center space-x-2 border-l border-gray-200 ${
                      viewMode === 'table'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <TableIcon className="h-4 w-4" />
                    <span>Tableau</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredRegulations.length === 0 ? (
              // État vide amélioré
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8"
                >
                  <EmptyStateIcon className="h-12 w-12 text-gray-400" />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-semibold text-gray-900 mb-3"
                >
                  Aucune réglementation trouvée
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed"
                >
                  {searchTerm || selectedDomaine 
                    ? 'Aucun résultat ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Aucune réglementation n\'est disponible pour le moment. Elles apparaîtront ici une fois ajoutées.'
                  }
                </motion.p>
                {(searchTerm || selectedDomaine) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDomaine('');
                      }}
                      className="px-6 py-3 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : viewMode === 'cards' ? (
              // Vue en cartes améliorée
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {Object.entries(groupedRegulations).map(([domaine, items], groupIndex) => (
                  <motion.div
                    key={domaine}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: groupIndex * 0.1 + 0.2 }}
                        className="text-2xl font-bold text-gray-900 flex items-center space-x-3"
                      >
                        <span>{domaine}</span>
                        <StatusBadge status="info" className="text-sm">
                          {items.length} {items.length > 1 ? 'éléments' : 'élément'}
                        </StatusBadge>
                      </motion.h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {items.map((regulation, index) => (
                        <motion.div
                          key={regulation.id}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          transition={{ 
                            delay: (groupIndex * 0.1) + (index * 0.05),
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }}
                        >
                          <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <CardHeader className="pb-4 relative z-10">
                              <div className="flex items-start justify-between space-x-3">
                                <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-blue-700 transition-colors duration-200 flex-1">
                                  {regulation.titre || 'Titre non défini'}
                                </CardTitle>
                                {regulation.conformite && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: (groupIndex * 0.1) + (index * 0.05) + 0.3 }}
                                  >
                                    <StatusBadge 
                                      status={regulation.conformite === 'Conforme' ? 'success' : 'danger'}
                                      className="flex-shrink-0 shadow-sm"
                                    >
                                      {regulation.conformite === 'Conforme' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                                      {regulation.conformite === 'Non conforme' && <AlertCircleIcon className="h-3 w-3 mr-1" />}
                                      {regulation.conformite}
                                    </StatusBadge>
                                  </motion.div>
                                )}
                              </div>
                              {regulation.documents && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: (groupIndex * 0.1) + (index * 0.05) + 0.4 }}
                                >
                                  <StatusBadge status="neutral" className="w-fit mt-3 flex items-center space-x-1">
                                    <DocumentIcon className="h-3 w-3" />
                                    <span>{regulation.documents}</span>
                                  </StatusBadge>
                                </motion.div>
                              )}
                            </CardHeader>
                            
                            <CardContent className="pt-0 relative z-10">
                              <div className="space-y-4">
                                {regulation.exigence && (
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800 text-sm flex items-center space-x-1">
                                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                      <span>Exigence</span>
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed bg-gray-50/50 rounded-lg p-3">
                                      {regulation.exigence}
                                    </p>
                                  </div>
                                )}
                                
                                {regulation.lois && (
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800 text-sm flex items-center space-x-1">
                                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                      <span>Références légales</span>
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed bg-amber-50/50 rounded-lg p-3">
                                      {regulation.lois}
                                    </p>
                                  </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                  <Button
                                    onClick={() => handleStartAudit(regulation)}
                                    variant="outline"
                                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                    size="sm"
                                  >
                                    <span className="flex items-center space-x-2">
                                      {regulation.conformite ? (
                                        <>
                                          <span>Modifier l'audit</span>
                                          <motion.svg 
                                            className="h-4 w-4" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                            animate={{ x: [0, 2, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </motion.svg>
                                        </>
                                      ) : (
                                        <>
                                          <span>Démarrer l'audit</span>
                                          <motion.svg 
                                            className="h-4 w-4" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                            animate={{ x: [0, 2, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                          </motion.svg>
                                        </>
                                      )}
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Vue en tableau améliorée
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl overflow-hidden"
              >
                <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                          <div className="flex items-center space-x-2">
                            <span>Domaine</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[200px]">
                          <div className="flex items-center space-x-2">
                            <span>Titre</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[300px]">
                          <div className="flex items-center space-x-2">
                            <span>Exigence</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                          <div className="flex items-center space-x-2">
                            <span>Documents</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                          <div className="flex items-center space-x-2">
                            <span>Statut</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                          <div className="flex items-center space-x-2">
                            <span>Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-50">
                      {filteredRegulations.map((regulation, index) => (
                        <motion.tr
                          key={regulation.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`transition-all duration-200 hover:bg-blue-50/50 cursor-pointer group border-l-4 border-transparent hover:border-blue-400 ${
                            index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                          }`}
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                              <div className="flex flex-col">
                                <span className="font-semibold truncate max-w-[120px]" title={regulation.domaine || 'Non défini'}>
                                  {regulation.domaine || 'Non défini'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-900">
                            <div className="max-w-[250px]">
                              <p className="font-semibold truncate cursor-help group-hover:text-blue-700 transition-colors" title={regulation.titre || 'Titre non défini'}>
                                {regulation.titre || 'Titre non défini'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600">
                            <div className="max-w-[350px]">
                              <p className="line-clamp-2 cursor-help leading-relaxed" title={regulation.exigence || 'Aucune exigence définie'}>
                                {regulation.exigence || 'Aucune exigence définie'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              {regulation.documents ? (
                                <StatusBadge status="neutral" className="flex items-center space-x-1">
                                  <DocumentIcon className="h-3 w-3 text-blue-500" />
                                  <span className="truncate max-w-[80px]" title={regulation.documents}>
                                    {regulation.documents}
                                  </span>
                                </StatusBadge>
                              ) : (
                                <span className="text-gray-400 italic">Aucun</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              {regulation.conformite ? (
                                <StatusBadge 
                                  status={regulation.conformite === 'Conforme' ? 'success' : 'danger'}
                                  className="shadow-sm flex items-center space-x-1"
                                >
                                  {regulation.conformite === 'Conforme' && <CheckCircleIcon className="h-3 w-3" />}
                                  {regulation.conformite === 'Non conforme' && <AlertCircleIcon className="h-3 w-3" />}
                                  <span>{regulation.conformite}</span>
                                </StatusBadge>
                              ) : (
                                <StatusBadge status="neutral" className="border-dashed flex items-center space-x-1">
                                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                  <span>En attente</span>
                                </StatusBadge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => handleStartAudit(regulation)}
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                              >
                                {regulation.conformite ? 'Modifier' : 'Auditer'}
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'audit améliorée */}
      <AnimatePresence>
        {showAuditModal && auditingRegulation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header de la modal */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                      <DocumentIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Audit de réglementation
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Évaluation de conformité réglementaire
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuditModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <XIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                
                {/* Contenu de la modal */}
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span>Titre</span>
                      </Label>
                      <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
                        <p className="text-gray-900 font-medium leading-relaxed">
                          {auditingRegulation.titre}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span>Domaine</span>
                      </Label>
                      <div className="p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100">
                        <StatusBadge status="info" className="text-sm">
                          {auditingRegulation.domaine}
                        </StatusBadge>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Exigence */}
                  {auditingRegulation.exigence && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>Exigence réglementaire</span>
                      </Label>
                      <div className="p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100">
                        <p className="text-gray-800 leading-relaxed text-sm">
                          {auditingRegulation.exigence}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Références légales */}
                  {auditingRegulation.lois && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                        <span>Références légales</span>
                      </Label>
                      <div className="p-6 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 rounded-xl border border-amber-100">
                        <p className="text-gray-800 leading-relaxed text-sm">
                          {auditingRegulation.lois}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Statut actuel */}
                  {auditingRegulation.conformite && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        <span>Statut de conformité actuel</span>
                      </Label>
                      <div className="p-4 bg-gradient-to-r from-gray-50/50 to-slate-50/50 rounded-xl border border-gray-100">
                        <StatusBadge 
                          status={auditingRegulation.conformite === 'Conforme' ? 'success' : 'danger'}
                          className="text-sm flex items-center space-x-2"
                        >
                          {auditingRegulation.conformite === 'Conforme' && <CheckCircleIcon className="h-4 w-4" />}
                          {auditingRegulation.conformite === 'Non conforme' && <AlertCircleIcon className="h-4 w-4" />}
                          <span>{auditingRegulation.conformite}</span>
                        </StatusBadge>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Notice de développement */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-yellow-800">Fonctionnalité en développement</h4>
                        <p className="text-sm text-yellow-700 leading-relaxed">
                          L'interface d'audit complète sera bientôt disponible avec des formulaires d'évaluation, 
                          la gestion des preuves de conformité, et le suivi des actions correctives.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Actions */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-end space-x-4 pt-6 border-t border-gray-100"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowAuditModal(false)}
                      className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={() => {
                        // TODO: Implémenter la logique d'audit
                        setShowAuditModal(false);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      <span className="flex items-center space-x-2">
                        <span>Commencer l'audit</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReglementationPage;