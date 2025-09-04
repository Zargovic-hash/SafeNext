// src/AuditDashboard.js - Version hybride avec toggle
import React, { useState, useEffect, useCallback } from 'react';
import DashboardStats from './components/DashboardStats.jsx';
import RegulationsTable from './components/RegulationsTable.jsx';
import AuditModal from './components/AuditModal.jsx';
import SearchFilters from './components/SearchFilters';
import ModernAuditDashboard from './components/modern/ModernAuditDashboard.jsx';  // Nouveau composant
import { useDebounce } from './hooks/useDebounce';
import { useAuditData } from './hooks/useAuditData.js';
import './styles/AuditDashboard.css';
import './styles/modern.css';

const AuditDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [editingAudit, setEditingAudit] = useState(null);
  const [useModernUI, setUseModernUI] = useState(false); // Toggle pour l'interface
  const [auditForm, setAuditForm] = useState({
    conformite: '',
    risque: '',
    faisabilite: '',
    plan_action: '',
    deadline: '',
    owner: ''
  });

  // Custom hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const {
    dashboardStats,
    regulations,
    domains,
    loading,
    filteredRegulations,
    saveAudit,
    isSaving,
    refreshData
  } = useAuditData(debouncedSearchTerm, selectedDomain);

  const resetAuditForm = useCallback(() => {
    setAuditForm({
      conformite: '',
      risque: '',
      faisabilite: '',
      plan_action: '',
      deadline: '',
      owner: ''
    });
  }, []);

  const handleEditAudit = useCallback((regulation) => {
    setEditingAudit(regulation.id);
    setAuditForm({
      conformite: regulation.conformite || '',
      risque: regulation.risque || '',
      faisabilite: regulation.faisabilite || '',
      plan_action: regulation.plan_action || '',
      deadline: regulation.deadline ? regulation.deadline.split('T')[0] : '',
      owner: regulation.owner || ''
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingAudit(null);
    resetAuditForm();
  }, [resetAuditForm]);

  const handleSaveAudit = useCallback(async () => {
    if (!auditForm.conformite) {
      alert('Veuillez sélectionner une conformité');
      return;
    }
    
    const success = await saveAudit(editingAudit, auditForm);
    if (success) {
      handleCloseModal();
    }
  }, [auditForm, editingAudit, saveAudit, handleCloseModal]);

  const handleInputChange = useCallback((field, value) => {
    setAuditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleExportCSV = useCallback(() => {
    // Vérifier que filteredRegulations est un tableau
    const regulations = Array.isArray(filteredRegulations) ? filteredRegulations : [];
    
    if (regulations.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    const csvData = regulations.map(reg => ({
      'Titre': reg.titre || '',
      'Domaine': reg.domaine || '',
      'Chapitre': reg.chapitre || '',
      'Exigence': reg.exigence || '',
      'Conformité': reg.conformite || '',
      'Risque': reg.risque || '',
      'Responsable': reg.owner || '',
      'Échéance': reg.deadline ? new Date(reg.deadline).toLocaleDateString() : '',
      'Plan d\'action': reg.plan_action || ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `regulations_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [filteredRegulations]);

  // Si l'interface moderne est activée, utiliser le nouveau composant
  if (useModernUI) {
    return (
      <ModernAuditDashboard 
        dashboardStats={dashboardStats}
        regulations={Array.isArray(filteredRegulations) ? filteredRegulations : []}
        loading={loading}
        onToggleUI={() => setUseModernUI(false)}
        onEditAudit={handleEditAudit}
        onExportCSV={handleExportCSV}
      />
    );
  }

  // Interface classique existante
  return (
    <div className="audit-dashboard">
      {/* Header avec bouton de toggle */}
      <header className="audit-header">
        <div className="audit-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className="audit-title">Audit Réglementaire</h1>
            <span className="audit-badge">v2.0.0</span>
            <button
              onClick={() => setUseModernUI(true)}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              ✨ Interface moderne
            </button>
          </div>
          
          <nav className="audit-nav">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`audit-nav-button ${activeTab === 'dashboard' ? 'active' : 'inactive'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('regulations')}
              className={`audit-nav-button ${activeTab === 'regulations' ? 'active' : 'inactive'}`}
            >
              Réglementations
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="audit-main">
        {loading ? (
          <div className="audit-loading">
            <div className="audit-spinner"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardStats 
                dashboardStats={dashboardStats}
                onRefresh={refreshData}
              />
            )}
            
            {activeTab === 'regulations' && (
              <div className="audit-dashboard-content">
                <SearchFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedDomain={selectedDomain}
                  onDomainChange={setSelectedDomain}
                  domains={domains}
                  onExport={handleExportCSV}
                  resultsCount={Array.isArray(filteredRegulations) ? filteredRegulations.length : 0}
                />
                
                <RegulationsTable
                  regulations={Array.isArray(filteredRegulations) ? filteredRegulations : []}
                  onEditAudit={handleEditAudit}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Audit Modal */}
      {editingAudit && (
        <AuditModal
          isOpen={!!editingAudit}
          auditForm={auditForm}
          onInputChange={handleInputChange}
          onSave={handleSaveAudit}
          onClose={handleCloseModal}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default AuditDashboard;