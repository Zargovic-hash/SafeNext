import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Search, Download, AlertTriangle, CheckCircle, 
  Clock, FileText, TrendingUp,
  Eye, Edit, Save, X
} from 'lucide-react';

// Styles CSS intégrés pour éviter les dépendances
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  nav: {
    display: 'flex',
    gap: '0.25rem'
  },
  navButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer'
  },
  navButtonActive: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontWeight: '500'
  },
  navButtonInactive: {
    color: '#6b7280',
    backgroundColor: 'transparent'
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  statCard: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    color: 'white'
  },
  statCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    fontWeight: '500',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  statusBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s'
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
    color: 'white'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem'
  },
  modal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    maxWidth: '32rem',
    width: '100%',
    margin: '1rem',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '16rem'
  },
  spinner: {
    width: '3rem',
    height: '3rem',
    border: '2px solid #e5e7eb',
    borderTop: '2px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

const API_BASE = 'http://localhost:3001/api';

const AuditDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [regulations, setRegulations] = useState([]);
  const [filteredRegulations, setFilteredRegulations] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [editingAudit, setEditingAudit] = useState(null);
  const [auditForm, setAuditForm] = useState({
    conformite: '',
    risque: '',
    faisabilite: '',
    plan_action: '',
    deadline: '',
    owner: ''
  });

  // Couleurs pour les graphiques
  const COLORS = {
    primary: '#3B82F6',
    success: '#10B981', 
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    indigo: '#6366F1'
  };

  const CHART_COLORS = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.purple, COLORS.indigo];

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`);
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  // Fetch regulations
  const fetchRegulations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reglementation`);
      const data = await response.json();
      setRegulations(data);
      setFilteredRegulations(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  // Fetch domains
  const fetchDomains = async () => {
    try {
      const response = await fetch(`${API_BASE}/reglementation/domaines`);
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Filter regulations
  useEffect(() => {
    let filtered = regulations;
    
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.exigence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.domaine?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDomain) {
      filtered = filtered.filter(reg => reg.domaine === selectedDomain);
    }
    
    setFilteredRegulations(filtered);
  }, [searchTerm, selectedDomain, regulations]);

  // Save audit - Version corrigée
  const saveAudit = async (reglementationId, auditData) => {
    try {
      console.log('🔄 Sauvegarde en cours...', { reglementationId, auditData });
      
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
      
      console.log('📡 Réponse status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Audit sauvegardé:', result);
        
        // Mettre à jour les données localement pour un affichage immédiat
        setRegulations(prev => prev.map(reg => 
          reg.id === reglementationId 
            ? { ...reg, ...auditData }
            : reg
        ));
        
        // Rafraîchir les données depuis le serveur
        await fetchRegulations();
        await fetchDashboardStats();
        
        // Fermer le modal
        setEditingAudit(null);
        resetAuditForm();
        
        // Notification visuelle (optionnelle)
        alert('✅ Audit sauvegardé avec succès !');
        
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur HTTP:', response.status, errorData);
        alert(`❌ Erreur lors de la sauvegarde: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      alert('❌ Erreur de connexion au serveur. Vérifiez que votre backend est démarré.');
    }
  };

  const resetAuditForm = () => {
    setAuditForm({
      conformite: '',
      risque: '',
      faisabilite: '',
      plan_action: '',
      deadline: '',
      owner: ''
    });
  };

  // Initial load
  useEffect(() => {
    fetchDashboardStats();
    fetchRegulations();
    fetchDomains();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Conforme': return { color: '#059669', backgroundColor: '#ecfdf5' };
      case 'Non Conforme': return { color: '#dc2626', backgroundColor: '#fef2f2' };
      case 'En Cours': return { color: '#d97706', backgroundColor: '#fffbeb' };
      default: return { color: '#6b7280', backgroundColor: '#f9fafb' };
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Élevé': return { color: '#dc2626', backgroundColor: '#fef2f2' };
      case 'Moyen': return { color: '#d97706', backgroundColor: '#fffbeb' };
      case 'Faible': return { color: '#059669', backgroundColor: '#ecfdf5' };
      default: return { color: '#6b7280', backgroundColor: '#f9fafb' };
    }
  };

  // Dashboard Tab
  const DashboardTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
          <div style={styles.statCardContent}>
            <div>
              <h3 style={{ color: 'rgba(219, 234, 254, 0.8)', fontSize: '0.875rem', fontWeight: '500' }}>
                Réglementations
              </h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                {dashboardStats?.totaux?.reglementations || 0}
              </p>
            </div>
            <FileText size={32} style={{ color: 'rgba(219, 234, 254, 0.6)' }} />
          </div>
        </div>
        
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          <div style={styles.statCardContent}>
            <div>
              <h3 style={{ color: 'rgba(236, 253, 245, 0.8)', fontSize: '0.875rem', fontWeight: '500' }}>
                Audits Réalisés
              </h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                {dashboardStats?.totaux?.audits || 0}
              </p>
            </div>
            <CheckCircle size={32} style={{ color: 'rgba(236, 253, 245, 0.6)' }} />
          </div>
        </div>
        
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
          <div style={styles.statCardContent}>
            <div>
              <h3 style={{ color: 'rgba(245, 243, 255, 0.8)', fontSize: '0.875rem', fontWeight: '500' }}>
                Taux d'Audit
              </h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                {dashboardStats?.totaux?.taux_audit || 0}%
              </p>
            </div>
            <TrendingUp size={32} style={{ color: 'rgba(245, 243, 255, 0.6)' }} />
          </div>
        </div>
        
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div style={styles.statCardContent}>
            <div>
              <h3 style={{ color: 'rgba(255, 251, 235, 0.8)', fontSize: '0.875rem', fontWeight: '500' }}>
                Échéances Proches
              </h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                {dashboardStats?.echeances_proches?.length || 0}
              </p>
            </div>
            <Clock size={32} style={{ color: 'rgba(255, 251, 235, 0.6)' }} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        {/* Conformité Chart */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Répartition par Conformité
          </h3>
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
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Audits par Domaine
          </h3>
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
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <AlertTriangle size={20} style={{ color: '#f59e0b', marginRight: '0.5rem' }} />
            Échéances Proches (30 jours)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Titre</th>
                  <th style={styles.th}>Domaine</th>
                  <th style={styles.th}>Échéance</th>
                  <th style={styles.th}>Responsable</th>
                  <th style={styles.th}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.echeances_proches.map((item, index) => (
                  <tr key={index} style={{ transition: 'background-color 0.2s' }}>
                    <td style={styles.td}>{item.titre}</td>
                    <td style={styles.td}>{item.domaine}</td>
                    <td style={styles.td}>{new Date(item.deadline).toLocaleDateString()}</td>
                    <td style={styles.td}>{item.owner}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, ...getStatusColor(item.conformite) }}>
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
  );

  // Regulations Tab - Version tableau améliorée
  const RegulationsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filters */}
      <div style={styles.card}>
        <div style={styles.filterGrid}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Rechercher dans les réglementations..."
              style={{ ...styles.input, paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => {
                e.stopPropagation();
                setSearchTerm(e.target.value);
              }}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>
          
          <select
            style={styles.input}
            value={selectedDomain}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedDomain(e.target.value);
            }}
          >
            <option value="">Tous les domaines</option>
            {domains.map((domain, index) => (
              <option key={index} value={domain.domaine}>{domain.domaine}</option>
            ))}
          </select>
          
          <button style={{ ...styles.button, ...styles.buttonPrimary }}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Regulations Table */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Liste des Réglementations ({filteredRegulations.length})
        </h3>
        
        <div style={{ overflowX: 'auto', maxHeight: '70vh', overflowY: 'auto' }}>
          <table style={styles.table}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9fafb', zIndex: 10 }}>
              <tr>
                <th style={{ ...styles.th, minWidth: '300px' }}>Réglementation</th>
                <th style={{ ...styles.th, minWidth: '150px' }}>Domaine</th>
                <th style={{ ...styles.th, minWidth: '100px' }}>Chapitre</th>
                <th style={{ ...styles.th, minWidth: '120px' }}>Conformité</th>
                <th style={{ ...styles.th, minWidth: '100px' }}>Risque</th>
                <th style={{ ...styles.th, minWidth: '120px' }}>Responsable</th>
                <th style={{ ...styles.th, minWidth: '120px' }}>Échéance</th>
                <th style={{ ...styles.th, minWidth: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegulations.map((reg, index) => (
                <tr key={index} className="hover-row" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={styles.td}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                        {reg.titre}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.4' }}>
                        {reg.exigence?.substring(0, 100)}
                        {reg.exigence?.length > 100 && '...'}
                      </div>
                      {reg.chapitre && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                          Ch. {reg.chapitre} {reg.sous_chapitre && `- ${reg.sous_chapitre}`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {reg.domaine}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {reg.chapitre || '-'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      ...getStatusColor(reg.conformite)
                    }}>
                      {reg.conformite || 'Non audité'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {reg.risque ? (
                      <span style={{
                        ...styles.statusBadge,
                        ...getRiskColor(reg.risque)
                      }}>
                        {reg.risque}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {reg.owner ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          marginRight: '8px'
                        }}>
                          {reg.owner.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem' }}>{reg.owner}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Non assigné</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {reg.deadline ? (
                      <span style={{ fontSize: '0.875rem' }}>
                        {new Date(reg.deadline).toLocaleDateString()}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
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
                        style={{
                          color: '#2563eb',
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dbeafe'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        style={{
                          color: '#6b7280',
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
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
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Aucune réglementation trouvée</p>
            <p style={{ fontSize: '0.875rem' }}>
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Audit Form Modal - Version corrigée */}
      {editingAudit && (
        <div 
          style={styles.modal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingAudit(null);
            }
          }}
        >
          <div 
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Audit de Conformité</h3>
              <button
                onClick={() => setEditingAudit(null)}
                style={{
                  color: '#9ca3af',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Conformité
                  </label>
                  <select
                    value={auditForm.conformite}
                    onChange={(e) => {
                      e.stopPropagation();
                      setAuditForm({...auditForm, conformite: e.target.value});
                    }}
                    style={styles.input}
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Conforme">Conforme</option>
                    <option value="Non Conforme">Non Conforme</option>
                    <option value="En Cours">En Cours</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Risque
                  </label>
                  <select
                    value={auditForm.risque}
                    onChange={(e) => {
                      e.stopPropagation();
                      setAuditForm({...auditForm, risque: e.target.value});
                    }}
                    style={styles.input}
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Faible">Faible</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Élevé">Élevé</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Faisabilité
                  </label>
                  <select
                    value={auditForm.faisabilite}
                    onChange={(e) => {
                      e.stopPropagation();
                      setAuditForm({...auditForm, faisabilite: e.target.value});
                    }}
                    style={styles.input}
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Facile">Facile</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Échéance
                  </label>
                  <input
                    type="date"
                    value={auditForm.deadline}
                    onChange={(e) => {
                      e.stopPropagation();
                      setAuditForm({...auditForm, deadline: e.target.value});
                    }}
                    style={styles.input}
                    onFocus={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Responsable
                </label>
                <input
                  type="text"
                  value={auditForm.owner}
                  onChange={(e) => {
                    e.stopPropagation();
                    setAuditForm({...auditForm, owner: e.target.value});
                  }}
                  placeholder="Nom du responsable"
                  style={styles.input}
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Plan d'action
                </label>
                <textarea
                  value={auditForm.plan_action}
                  onChange={(e) => {
                    e.stopPropagation();
                    setAuditForm({...auditForm, plan_action: e.target.value});
                  }}
                  placeholder="Décrivez le plan d'action..."
                  rows={4}
                  style={{ ...styles.input, resize: 'vertical', minHeight: '100px' }}
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingAudit(null);
                  resetAuditForm();
                }}
                style={{
                  padding: '8px 16px',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  
                  // Validation simple
                  if (!auditForm.conformite) {
                    alert('⚠️ Veuillez sélectionner une conformité');
                    return;
                  }
                  
                  // Désactiver le bouton pendant la sauvegarde
                  e.target.disabled = true;
                  e.target.style.opacity = '0.6';
                  e.target.innerHTML = '⏳ Sauvegarde...';
                  
                  try {
                    await saveAudit(editingAudit, auditForm);
                  } finally {
                    // Réactiver le bouton (si le modal n'est pas fermé)
                    if (e.target) {
                      e.target.disabled = false;
                      e.target.style.opacity = '1';
                      e.target.innerHTML = '💾 Sauvegarder';
                    }
                  }
                }}
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary
                }}
              >
                <Save size={16} />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* CSS pour les animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .hover-row:hover {
            background-color: #f9fafb !important;
          }
          
          .hover-button:hover {
            opacity: 0.8;
            transform: translateY(-1px);
          }
        `}
      </style>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={styles.title}>
              🚀 Audit Réglementaire
            </h1>
            <span style={styles.badge}>v2.0.0</span>
          </div>
          
          <nav style={styles.nav}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                ...styles.navButton,
                ...(activeTab === 'dashboard' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('regulations')}
              style={{
                ...styles.navButton,
                ...(activeTab === 'regulations' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              Réglementations
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
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