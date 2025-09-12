import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LoadingSpinner } from "../components/ui/componentsui";
import { Card, CardContent } from "../components/ui/componentsui";
import { Button } from "../components/ui/componentsui";
import { motion } from 'framer-motion';
import { AlertCircleIcon } from "../icons/icon";
import { useAuth } from '../context/AuthContext';
import AuditModal from '../components/AuditModal.jsx';

// Import des nouveaux composants
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import CardsView from '../components/CardsView.jsx';
import TableView from '../components/TableView.jsx';
import SaveMessage from '../components/SaveMessage.jsx';
import FullscreenOverlay from '../components/FullscreenOverlay.jsx';

const ReglementationPage = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [auditingRegulation, setAuditingRegulation] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const { token } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);


  // États pour les filtres avancés avec domaine intégré
  const [filters, setFilters] = useState({
    domaine: '',
    statut: '',
    prioritée: '',
    owner: '',
    deadlineProche: ''
  });

  // État pour le formulaire d'audit
  const [auditForm, setAuditForm] = useState({
    conformite: '',
    prioritée: '',
    faisabilite: '',
    deadline: '',
    owner: '',
    plan_action: ''
  });

  const API_BASE = 'http://localhost:3001/api';

  // Fonction pour basculer en mode plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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
    setFilters({
      domaine: '',
      statut: '',
      prioritée: '',
      owner: '',
      deadlineProche: ''
    });
  }, []);

  // Filtrer les données
  const filteredRegulations = useMemo(() => {
    return regulations.filter(reg => {
      const matchesSearch = !searchTerm || 
        reg.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.exigence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.domaine?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDomaine = !filters.domaine || reg.domaine === filters.domaine;
      const matchesStatut = !filters.statut || reg.conformite === filters.statut;
      const matchesPriorité = !filters.prioritée || reg.prioritée === filters.prioritée;
      const matchesOwner = !filters.owner || reg.owner === filters.owner;
      
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
             matchesPriorité && matchesOwner && matchesDeadline;
    });
  }, [regulations, searchTerm, filters]);

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
      prioritée: regulation.prioritée || '',
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
          prioritée: '',
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
      prioritée: '',
      faisabilite: '',
      deadline: '',
      owner: '',
      plan_action: ''
    });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <LoadingSpinner size="lg" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Chargement des réglementations</h3>
              <p className="text-sm text-gray-600">Veuillez patienter...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
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
                className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircleIcon className="h-10 w-10 text-red-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
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
    <div className={`<min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50> ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex flex-col h-screen">
        {/* Header avec Summary Dashboard */}
        <PageHeader
          filteredRegulations={filteredRegulations}
          filters={filters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleFilterChange={handleFilterChange}
          handleResetFilters={handleResetFilters}
          regulations={regulations}
        />

        {/* Content Area - Optimisé pour plus d'espace */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredRegulations.length === 0 ? (
            <EmptyState
              searchTerm={searchTerm}
              filters={filters}
              handleResetFilters={handleResetFilters}
            />
          ) : viewMode === 'cards' ? (
            <CardsView
              groupedRegulations={groupedRegulations}
              isFullscreen={isFullscreen}
              handleStartAudit={handleStartAudit}
            />
          ) : (
            <TableView
              filteredRegulations={filteredRegulations}
              isFullscreen={isFullscreen}
              handleStartAudit={handleStartAudit}
            />
          )}
        </div>
      </div>

      {/* Components externes */}
      <SaveMessage saveMessage={saveMessage} />

      {/* Modal d'audit */}
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

      {/* Overlay pour le mode plein écran */}
      <FullscreenOverlay isFullscreen={isFullscreen} />
    </div>
  );
};

export default ReglementationPage;