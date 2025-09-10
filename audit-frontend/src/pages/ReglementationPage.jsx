import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import AuditModal from '../components/AuditModal.jsx';

// Icons
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

const FilterIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const CalendarIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const TrendingUpIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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

// Composant Summary Dashboard
const SummaryDashboard = ({ regulations, className = "" }) => {
  const stats = useMemo(() => {
    const total = regulations.length;
    const conforme = regulations.filter(r => r.conformite === 'Conforme').length;
    const nonConforme = regulations.filter(r => r.conformite === 'Non conforme').length;
    const enAttente = total - conforme - nonConforme;
    
    const risqueElevé = regulations.filter(r => r.risque === 'Élevé').length;
    const risqueMoyen = regulations.filter(r => r.risque === 'Moyen').length;
    const risqueFaible = regulations.filter(r => r.risque === 'Faible').length;
    
    // Calcul des deadlines approchantes (dans les 30 jours)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    const deadlinesProches = regulations.filter(r => {
      if (!r.deadline) return false;
      const deadline = new Date(r.deadline);
      return deadline >= today && deadline <= thirtyDaysFromNow;
    }).length;

    return {
      total,
      conforme,
      nonConforme,
      enAttente,
      risqueElevé,
      risqueMoyen,
      risqueFaible,
      deadlinesProches,
      conformiteRate: total > 0 ? Math.round((conforme / total) * 100) : 0
    };
  }, [regulations]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              <p className="text-xs text-blue-600 font-medium">Total</p>
            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <DocumentIcon className="h-4 w-4 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-emerald-700">{stats.conforme}</p>
              <p className="text-xs text-emerald-600 font-medium">Conformes</p>
            </div>
            <div className="p-2 bg-emerald-200 rounded-lg">
              <CheckCircleIcon className="h-4 w-4 text-emerald-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.nonConforme}</p>
              <p className="text-xs text-red-600 font-medium">Non conformes</p>
            </div>
            <div className="p-2 bg-red-200 rounded-lg">
              <AlertCircleIcon className="h-4 w-4 text-red-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-amber-700">{stats.risqueElevé}</p>
              <p className="text-xs text-amber-600 font-medium">Risque élevé</p>
            </div>
            <div className="p-2 bg-amber-200 rounded-lg">
              <TrendingUpIcon className="h-4 w-4 text-amber-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-700">{stats.deadlinesProches}</p>
              <p className="text-xs text-purple-600 font-medium">Échéances 30j</p>
            </div>
            <div className="p-2 bg-purple-200 rounded-lg">
              <CalendarIcon className="h-4 w-4 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-indigo-700">{stats.conformiteRate}%</p>
              <p className="text-xs text-indigo-600 font-medium">Conformité</p>
            </div>
            <div className="p-2 bg-indigo-200 rounded-lg">
              <div className="h-4 w-4 bg-indigo-700 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Composant Advanced Filters
const AdvancedFilters = ({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  regulations,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const uniqueValues = useMemo(() => {
    return {
      statuts: [...new Set(regulations.map(r => r.conformite).filter(Boolean))],
      risques: [...new Set(regulations.map(r => r.risque).filter(Boolean))],
      owners: [...new Set(regulations.map(r => r.owner).filter(Boolean))]
    };
  }, [regulations]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value && value !== '').length;
  }, [filters]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <FilterIcon className="h-5 w-5" />
            <span>Filtres avancés</span>
            {activeFiltersCount > 0 && (
              <StatusBadge status="info" className="ml-2">
                {activeFiltersCount}
              </StatusBadge>
            )}
            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              Réinitialiser
            </Button>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Filtre par statut */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Statut</span>
                </Label>
                <select
                  value={filters.statut}
                  onChange={(e) => onFilterChange('statut', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Tous les statuts</option>
                  {uniqueValues.statuts.map(statut => (
                    <option key={statut} value={statut}>{statut}</option>
                  ))}
                </select>
              </div>

              {/* Filtre par risque */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <TrendingUpIcon className="h-4 w-4" />
                  <span>Niveau de risque</span>
                </Label>
                <select
                  value={filters.risque}
                  onChange={(e) => onFilterChange('risque', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Tous les risques</option>
                  {uniqueValues.risques.map(risque => (
                    <option key={risque} value={risque}>{risque}</option>
                  ))}
                </select>
              </div>

              {/* Filtre par propriétaire */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <UserIcon className="h-4 w-4" />
                  <span>Propriétaire</span>
                </Label>
                <select
                  value={filters.owner}
                  onChange={(e) => onFilterChange('owner', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Tous les propriétaires</option>
                  {uniqueValues.owners.map(owner => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </select>
              </div>

              {/* Filtre par échéance proche */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Échéances</span>
                </Label>
                <select
                  value={filters.deadlineProche}
                  onChange={(e) => onFilterChange('deadlineProche', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Toutes les échéances</option>
                  <option value="7">Dans 7 jours</option>
                  <option value="30">Dans 30 jours</option>
                  <option value="90">Dans 90 jours</option>
                  <option value="expired">Échues</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const { token } = useAuth();

  // États pour les filtres avancés
  const [filters, setFilters] = useState({
    statut: '',
    risque: '',
    owner: '',
    deadlineProche: ''
  });

  // État pour le formulaire d'audit
  const [auditForm, setAuditForm] = useState({
    conformite: '',
    risque: '',
    faisabilite: '',
    deadline: '',
    owner: '',
    plan_action: ''
  });

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

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  // Fonction pour réinitialiser les filtres
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedDomaine('');
    setFilters({
      statut: '',
      risque: '',
      owner: '',
      deadlineProche: ''
    });
  }, []);

  // Filtrer les données avec logique améliorée
  const filteredRegulations = useMemo(() => {
    return regulations.filter(reg => {
      // Filtre de recherche textuelle
      const matchesSearch = !searchTerm || 
        reg.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.exigence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.domaine?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par domaine
      const matchesDomaine = !selectedDomaine || reg.domaine === selectedDomaine;
      
      // Filtre par statut
      const matchesStatut = !filters.statut || reg.conformite === filters.statut;
      
      // Filtre par risque
      const matchesRisque = !filters.risque || reg.risque === filters.risque;
      
      // Filtre par propriétaire
      const matchesOwner = !filters.owner || reg.owner === filters.owner;
      
      // Filtre par échéance proche
      const matchesDeadline = (() => {
        if (!filters.deadlineProche) return true;
        if (!reg.deadline) return false;
        
        const today = new Date();
        const deadline = new Date(reg.deadline);
        
        switch (filters.deadlineProche) {
          case '7':
            const sevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
            return deadline >= today && deadline <= sevenDays;
          case '30':
            const thirtyDays = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
            return deadline >= today && deadline <= thirtyDays;
          case '90':
            const ninetyDays = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
            return deadline >= today && deadline <= ninetyDays;
          case 'expired':
            return deadline < today;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesDomaine && matchesStatut && 
             matchesRisque && matchesOwner && matchesDeadline;
    });
  }, [regulations, searchTerm, selectedDomaine, filters]);

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

  // Fonction pour gérer les changements dans le formulaire d'audit
  const handleAuditInputChange = useCallback((field, value) => {
    setAuditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Fonction pour démarrer l'audit
  const handleStartAudit = useCallback((regulation) => {
    setAuditingRegulation(regulation);
    setAuditForm({
      conformite: regulation.conformite || '',
      risque: regulation.risque || '',
      faisabilite: regulation.faisabilite || '',
      deadline: regulation.deadline || '',
      owner: regulation.owner || '',
      plan_action: regulation.plan_action || ''
    });
    setShowAuditModal(true);
  }, []);

  // Fonction pour sauvegarder l'audit
  const handleSaveAudit = useCallback(async () => {
    if (!auditingRegulation || !token) return;

    try {
      setIsSaving(true);
      setSaveMessage(null);

      const response = await fetch(`${API_BASE}/audit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reglementation_id: auditingRegulation.id,
          ...auditForm
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      setRegulations(prev => 
        prev.map(reg => 
          reg.id === auditingRegulation.id ? { ...reg, ...auditForm } : reg
        )
      );

      setSaveMessage({ type: 'success', text: 'Audit sauvegardé avec succès !' });

      setTimeout(() => {
        setShowAuditModal(false);
        setAuditingRegulation(null);
        setAuditForm({
          conformite: '',
          risque: '',
          faisabilite: '',
          deadline: '',
          owner: '',
          plan_action: ''
        });
        setSaveMessage(null);
      }, 1500);

    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'audit:', err);
      setSaveMessage({ type: 'error', text: `Erreur: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  }, [auditingRegulation, token, auditForm]);

  // Fonction pour fermer la modal
  const handleCloseAuditModal = useCallback(() => {
    setShowAuditModal(false);
    setAuditingRegulation(null);
    setAuditForm({
      conformite: '',
      risque: '',
      faisabilite: '',
      deadline: '',
      owner: '',
      plan_action: ''
    });
  }, []);

  // Loading state amélioré
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex h-screen">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
          {/* Header amélioré avec Summary Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-6 shadow-sm"
          >
            <div className="space-y-6">
              {/* Title and Search Section */}
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

              {/* Summary Dashboard */}
              <SummaryDashboard regulations={filteredRegulations} />

              {/* Advanced Filters */}
              <AdvancedFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                regulations={regulations}
              />
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
                  {searchTerm || selectedDomaine || Object.values(filters).some(f => f)
                    ? 'Aucun résultat ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Aucune réglementation n\'est disponible pour le moment. Elles apparaîtront ici une fois ajoutées.'
                  }
                </motion.p>
                {(searchTerm || selectedDomaine || Object.values(filters).some(f => f)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
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
                                      status={regulation.conformite === 'Conforme' ? 'success' : regulation.conformite === 'Non conforme' ? 'danger' : 'warning'}
                                      className="flex-shrink-0 shadow-sm"
                                    >
                                      {regulation.conformite === 'Conforme' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                                      {regulation.conformite === 'Non conforme' && <AlertCircleIcon className="h-3 w-3 mr-1" />}
                                      {regulation.conformite}
                                    </StatusBadge>
                                  </motion.div>
                                )}
                              </div>
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
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-800 text-sm flex items-center space-x-1">
                                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                      <span>Références légales</span>
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-6 leading-relaxed bg-amber-50/50 rounded-lg p-3">
                                      {regulation.lois}
                                    </p>
                                  </div>
                                )}

                                {/* Affichage des informations d'audit */}
                                {(regulation.risque || regulation.owner || regulation.deadline) && (
                                  <div className="space-y-3 pt-2 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                      {regulation.risque && (
                                        <StatusBadge 
                                          status={regulation.risque === 'Élevé' ? 'danger' : regulation.risque === 'Moyen' ? 'warning' : 'success'}
                                          className="text-xs"
                                        >
                                          <TrendingUpIcon className="h-3 w-3 mr-1" />
                                          {regulation.risque}
                                        </StatusBadge>
                                      )}
                                      {regulation.owner && (
                                        <StatusBadge status="neutral" className="text-xs">
                                          <UserIcon className="h-3 w-3 mr-1" />
                                          {regulation.owner}
                                        </StatusBadge>
                                      )}
                                      {regulation.deadline && (
                                        <StatusBadge status="info" className="text-xs">
                                          <CalendarIcon className="h-3 w-3 mr-1" />
                                          {new Date(regulation.deadline).toLocaleDateString()}
                                        </StatusBadge>
                                      )}
                                    </div>
                                  </div>
                                )}

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
                <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
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
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                          <div className="flex items-center space-x-2">
                            <span>Statut</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                          <div className="flex items-center space-x-2">
                            <span>Risque</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                          <div className="flex items-center space-x-2">
                            <span>Propriétaire</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                          <div className="flex items-center space-x-2">
                            <span>Échéance</span>
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
                          <td className="px-6 py-5 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              {regulation.conformite ? (
                                <StatusBadge 
                                  status={regulation.conformite === 'Conforme' ? 'success' : regulation.conformite === 'Non conforme' ? 'danger' : 'warning'}
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
                          <td className="px-6 py-5 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              {regulation.risque ? (
                                <StatusBadge 
                                  status={regulation.risque === 'Élevé' ? 'danger' : regulation.risque === 'Moyen' ? 'warning' : 'success'}
                                  className="shadow-sm flex items-center space-x-1"
                                >
                                  <TrendingUpIcon className="h-3 w-3" />
                                  <span>{regulation.risque}</span>
                                </StatusBadge>
                              ) : (
                                <span className="text-gray-400 italic text-xs">Non assigné</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              {regulation.deadline ? (
                                <StatusBadge 
                                  status={new Date(regulation.deadline) < new Date() ? 'danger' : 'info'}
                                  className="flex items-center space-x-1"
                                >
                                  <CalendarIcon className="h-3 w-3" />
                                  <span>{new Date(regulation.deadline).toLocaleDateString()}</span>
                                </StatusBadge>
                              ) : (
                                <span className="text-gray-400 italic text-xs">Non définie</span>
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

      {/* Message de sauvegarde amélioré */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border-0 backdrop-blur-sm ${
              saveMessage.type === 'success' 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              {saveMessage.type === 'success' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                >
                  <CheckCircleIcon className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                >
                  <AlertCircleIcon className="h-6 w-6" />
                </motion.div>
              )}
              <div>
                <span className="font-semibold text-sm">{saveMessage.text}</span>
                {saveMessage.type === 'success' && (
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                    <span className="text-xs text-white/80">Fermeture automatique dans 2s</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'audit améliorée avec AuditModal */}
      <AuditModal
        isOpen={showAuditModal}
        regulation={auditingRegulation}
        auditForm={auditForm}
        onInputChange={handleAuditInputChange}
        onSave={handleSaveAudit}
        onClose={handleCloseAuditModal}
        isSaving={isSaving}
        saveMessage={saveMessage}
      />
    </div>
  );
};

export default ReglementationPage;