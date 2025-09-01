import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Search, Download, AlertTriangle, CheckCircle, 
  Clock, FileText, TrendingUp,
  Eye, Edit, Save, X
} from 'lucide-react';
import './styles/AuditDashboard.css';

const API_BASE = 'http://localhost:3001/api';

// Hook personnalisé pour le debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AuditDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [regulations, setRegulations] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [editingAudit, setEditingAudit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [auditForm, setAuditForm] = useState({
    conformite: '',
    risque: '',
    faisabilite: '',
    plan_action: '',
    deadline: '',
    owner: ''
  });

  // Debounce search term pour améliorer les performances
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtrage mémorisé des réglementations
  const filteredRegulations = useMemo(() => {
    let filtered = regulations;
    
    if (debouncedSearchTerm) {
      filtered = filtered.filter(reg => 
        reg.titre?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        reg.exigence?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        reg.domaine?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    if (selectedDomain) {
      filtered = filtered.filter(reg => reg.domaine === selectedDomain);
    }
    
    return filtered;
  }, [debouncedSearchTerm, selectedDomain, regulations]);

  // Couleurs pour les graphiques
  const COLORS = {
    primary: '#3B82F6',
    success: '#10B981', 
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    indigo: '#6366F1'
  };

  const CHART_COLORS = [
    COLORS.primary, 
    COLORS.success, 
    COLORS.warning, 
    COLORS.danger, 
    COLORS.purple, 
    COLORS.indigo
  ];

  // Fetch dashboard stats avec gestion d'erreur améliorée
  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);

  // Fetch regulations avec gestion d'erreur améliorée
  const fetchRegulations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/reglementation`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRegulations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réglementations:', error);
    }
  }, []);

  // Fetch domains
  const fetchDomains = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/reglementation/domaines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Erreur lors du chargement des domaines:', error);
    }
  }, []);

  // Save audit avec gestion des états
  const saveAudit = useCallback(async (reglementationId, auditData) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      console.log('Sauvegarde en cours...', { reglementationId, auditData });
      
      const response = await fetch(`${API_BASE}/audit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reglementation_id: reglementationId,
          ...auditData
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Audit sauvegardé:', result);
        
        // Mettre à jour les données localement
        setRegulations(prev => prev.map(reg => 
          reg.id === reglementationId 
            ? { ...reg, ...auditData }
            : reg
        ));
        
        // Rafraîchir les données
        await Promise.all([
          fetchRegulations(),
          fetchDashboardStats()
        ]);
        
        // Fermer le modal
        setEditingAudit(null);
        resetAuditForm();
        
        alert('Audit sauvegardé avec succès !');
        
      } else {
        const errorData = await response.json();
        console.error('Erreur HTTP:', response.status, errorData);
        alert(`Erreur lors de la sauvegarde: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur de connexion au serveur.');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, fetchRegulations, fetchDashboardStats]);

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

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchRegulations(),
          fetchDomains()
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement initial:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchDashboardStats, fetchRegulations, fetchDomains]);

  const getStatusClass = useCallback((status) => {
    switch (status) {
      case 'Conforme': return 'conforme';
      case 'Non Conforme': return 'non-conforme';
      case 'En Cours': return 'en-cours';
      default: return 'default';
    }
  }, []);

  const getRiskClass = useCallback((risk) => {
    switch (risk) {
      case 'Élevé': return 'eleve';
      case 'Moyen': return 'moyen';
      case 'Faible': return 'faible';
      default: return 'default';
    }
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setAuditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Dashboard Tab
  const DashboardTab = React.memo(() => (
    <div className="audit-dashboard-content">
      {/* Stats Cards */}
      <div className="audit-stats-grid">
        <div className="audit-stat-card primary">
          <div className="audit-stat-card-content">
            <div>
              <h3 className="audit-stat-title" style={{ color: 'rgba(219, 234, 254, 0.8)' }}>
                Réglementations
              </h3>
              <p className="audit-stat-value">
                {dashboardStats?.totaux?.reglementations || 0}
              </p>
            </div>
            <FileText size={32} style={{ color: 'rgba(219, 234, 254, 0.6)' }} />
          </div>
        </div>
        
        <div className="audit-stat-card success">
          <div className="audit-stat-card-content">
            <div>
              <h3 className="audit-stat-title" style={{ color: 'rgba(236, 253, 245, 0.8)' }}>
                Audits Réalisés
              </h3>
              <p className="audit-stat-value">
                {dashboardStats?.totaux?.audits || 0}
              </p>
            </div>
            <CheckCircle size={32} style={{ color: 'rgba(236, 253, 245, 0.6)' }} />
          </div>
        </div>
        
        <div className="audit-stat-card purple">
          <div className="audit-stat-card-content">
            <div>
              <h3 className="audit-stat-title" style={{ color: 'rgba(245, 243, 255, 0.8)' }}>
                Taux d'Audit
              </h3>
              <p className="audit-stat-value">
                {dashboardStats?.totaux?.taux_audit || 0}%
              </p>
            </div>
            <TrendingUp size={32} style={{ color: 'rgba(245, 243, 255, 0.6)' }} />
          </div>
        </div>
        
        <div className="audit-stat-card warning">
          <div className="audit-stat-card-content">
            <div>
              <h3 className="audit-stat-title" style={{ color: 'rgba(255, 251, 235, 0.8)' }}>
                Échéances Proches
              </h3>
              <p className="audit-stat-value">
                {dashboardStats?.echeances_proches?.length || 0}
              </p>
            </div>
            <Clock size={32} style={{ color: 'rgba(255, 251, 235, 0.6)' }} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="audit-charts-grid">
        {/* Conformité Chart */}
        <div className="audit-card">
          <h3 className="audit-chart-title">Répartition par Conformité</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardStats?.conformite || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({conformite, count}) => `${conformite}: ${count}`}
              >
                {(dashboardStats?.conformite || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Domaines Chart */}
        <div className="audit-card">
          <h3 className="audit-chart-title">Audits par Domaine</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardStats?.domaines?.slice(0, 8) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="domaine" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="audites" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Échéances Proches */}
      {dashboardStats?.echeances_proches?.length > 0 && (
        <div className="audit-card">
          <h3 className="audit-deadline-header">
            <AlertTriangle size={20} className="audit-deadline-icon" />
            Échéances Proches (30 jours)
          </h3>
          <div className="audit-table-container">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Domaine</th>
                  <th>Échéance</th>
                  <th>Responsable</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.echeances_proches.map((item, index) => (
                  <tr key={index}>
                    <td>{item.titre}</td>
                    <td>{item.domaine}</td>
                    <td>{new Date(item.deadline).toLocaleDateString()}</td>
                    <td>{item.owner}</td>
                    <td>
                      <span className={`audit-status-badge ${getStatusClass(item.conformite)}`}>
                        {item.conformite || 'Non audité'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  ));

  // Regulations Tab
  const RegulationsTab = React.memo(() => (
    <div className="audit-dashboard-content">
      {/* Filters */}
      <div className="audit-card">
        <div className="audit-filter-grid">
          <div className="audit-search-container">
            <Search size={20} className="audit-search-icon" />
            <input
              type="text"
              placeholder="Rechercher dans les réglementations..."
              className="audit-input audit-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="audit-input"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <option value="">Tous les domaines</option>
            {domains.map((domain, index) => (
              <option key={index} value={domain.domaine}>{domain.domaine}</option>
            ))}
          </select>
          
          <button className="audit-button primary">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Regulations Table */}
      <div className="audit-card">
        <h3 className="audit-chart-title">
          Liste des Réglementations ({filteredRegulations.length})
        </h3>
        
        <div className="audit-table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th className="col-regulation">Réglementation</th>
                <th className="col-domain">Domaine</th>
                <th className="col-chapter">Chapitre</th>
                <th className="col-conformity">Conformité</th>
                <th className="col-risk">Risque</th>
                <th className="col-owner">Responsable</th>
                <th className="col-deadline">Échéance</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegulations.map((reg, index) => (
                <tr key={reg.id || index}>
                  <td>
                    <div>
                      <div className="audit-regulation-title">
                        {reg.titre}
                      </div>
                      <div className="audit-regulation-description">
                        {reg.exigence?.substring(0, 100)}
                        {reg.exigence?.length > 100 && '...'}
                      </div>
                      {reg.chapitre && (
                        <div className="audit-regulation-chapter">
                          Ch. {reg.chapitre} {reg.sous_chapitre && `- ${reg.sous_chapitre}`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="audit-domain-badge">
                      {reg.domaine}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {reg.chapitre || '-'}
                    </span>
                  </td>
                  <td>
                    <span className={`audit-status-badge ${getStatusClass(reg.conformite)}`}>
                      {reg.conformite || 'Non audité'}
                    </span>
                  </td>
                  <td>
                    {reg.risque ? (
                      <span className={`audit-risk-badge ${getRiskClass(reg.risque)}`}>
                        {reg.risque}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                    )}
                  </td>
                  <td>
                    {reg.owner ? (
                      <div className="audit-user-avatar">
                        <div className="audit-user-avatar-circle">
                          {reg.owner.charAt(0).toUpperCase()}
                        </div>
                        <span className="audit-user-name">{reg.owner}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Non assigné</span>
                    )}
                  </td>
                  <td>
                    {reg.deadline ? (
                      <span style={{ fontSize: '0.875rem' }}>
                        {new Date(reg.deadline).toLocaleDateString()}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                    )}
                  </td>
                  <td>
                    <div className="audit-actions">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingAudit(reg.id);
                          setAuditForm({
                            conformite: reg.conformite || '',
                            risque: reg.risque || '',
                            faisabilite: reg.faisabilite || '',
                            plan_action: reg.plan_action || '',
                            deadline: reg.deadline ? reg.deadline.split('T')[0] : '',
                            owner: reg.owner || ''
                          });
                        }}
                        className="audit-action-button edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="audit-action-button view">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRegulations.length === 0 && (
          <div className="audit-empty-state">
            <FileText size={48} className="audit-empty-icon" />
            <p className="audit-empty-title">Aucune réglementation trouvée</p>
            <p className="audit-empty-description">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Audit Form Modal */}
      {editingAudit && (
        <div 
          className="audit-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingAudit(null);
              resetAuditForm();
            }
          }}
        >
          <div 
            className="audit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="audit-modal-header">
              <h3 className="audit-modal-title">Audit de Conformité</h3>
              <button
                onClick={() => {
                  setEditingAudit(null);
                  resetAuditForm();
                }}
                className="audit-modal-close"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="audit-modal-body">
              <div className="audit-modal-row">
                <div className="audit-form-group">
                  <label className="audit-form-label">Conformité</label>
                  <select
                    value={auditForm.conformite}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleInputChange('conformite', e.target.value);
                    }}
                    className="audit-input"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Conforme">Conforme</option>
                    <option value="Non Conforme">Non Conforme</option>
                    <option value="En Cours">En Cours</option>
                  </select>
                </div>
                
                <div className="audit-form-group">
                  <label className="audit-form-label">Risque</label>
                  <select
                    value={auditForm.risque}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleInputChange('risque', e.target.value);
                    }}
                    className="audit-input"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Faible">Faible</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Élevé">Élevé</option>
                  </select>
                </div>
              </div>
              
              <div className="audit-modal-row">
                <div className="audit-form-group">
                  <label className="audit-form-label">Faisabilité</label>
                  <select
                    value={auditForm.faisabilite}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleInputChange('faisabilite', e.target.value);
                    }}
                    className="audit-input"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyenne</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
                
                <div className="audit-form-group">
                  <label className="audit-form-label">Échéance</label>
                  <input
                    type="date"
                    value={auditForm.deadline}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleInputChange('deadline', e.target.value);
                    }}
                    className="audit-input"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              <div className="audit-form-group">
                <label className="audit-form-label">Responsable</label>
                <input
                  type="text"
                  value={auditForm.owner}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleInputChange('owner', e.target.value);
                  }}
                  placeholder="Nom du responsable"
                  className="audit-input"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="audit-form-group">
                <label className="audit-form-label">Plan d'action</label>
                <textarea
                  value={auditForm.plan_action}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleInputChange('plan_action', e.target.value);
                  }}
                  placeholder="Décrivez le plan d'action..."
                  rows={4}
                  className="audit-input audit-textarea"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            <div className="audit-modal-footer">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingAudit(null);
                  resetAuditForm();
                }}
                disabled={isSaving}
                className="audit-button secondary"
              >
                Annuler
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  
                  if (!auditForm.conformite) {
                    alert('Veuillez sélectionner une conformité');
                    return;
                  }
                  
                  await saveAudit(editingAudit, auditForm);
                }}
                disabled={isSaving}
                className="audit-button primary"
              >
                <Save size={16} />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ));

  return (
    <div className="audit-dashboard">
      {/* Header */}
      <header className="audit-header">
        <div className="audit-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className="audit-title">Audit Réglementaire</h1>
            <span className="audit-badge">v2.0.0</span>
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
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'regulations' && <RegulationsTab />}
          </>
        )}
      </main>
    </div>
  );
};

export default AuditDashboard;