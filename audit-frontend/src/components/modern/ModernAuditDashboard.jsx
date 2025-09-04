// src/components/modern/ModernAuditDashboard.jsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  TrendingUp, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit3,
  Eye,
  Calendar,
  User,
  Shield,
  PieChart,
  Settings,
  Bell,
  Menu,
  ArrowLeft
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "stat-card-blue",
    green: "stat-card-green", 
    purple: "stat-card-purple",
    amber: "stat-card-amber",
    red: "stat-card-red"
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
            {title}
          </p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
            {value}
          </p>
          {change && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} style={{ color: trend === 'up' ? 'rgba(16,185,129,0.8)' : 'rgba(239,68,68,0.8)' }} />
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                {change}%
              </span>
            </div>
          )}
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, onClick, color = "blue" }) => (
  <div 
    onClick={onClick}
    className="quick-action-card"
    style={{ cursor: 'pointer' }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div className={`action-icon action-icon-${color}`}>
        <Icon size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '4px', margin: 0 }}>
          {title}
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

const RegulationCard = ({ regulation, onEditAudit }) => {
  // Vérification que regulation est bien un objet et a les propriétés nécessaires
  if (!regulation || typeof regulation !== 'object') {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Conforme': return { text: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
      case 'Non Conforme': return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
      case 'En Cours': return { text: '#d97706', bg: '#fffbeb', border: '#fed7aa' };
      default: return { text: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Élevé': return '#dc2626';
      case 'Moyen': return '#d97706';
      case 'Faible': return '#059669';
      default: return '#6b7280';
    }
  };

  const statusColors = getStatusColor(regulation.conformite);
  const progress = regulation.progress || Math.floor(Math.random() * 100);
  
  // Formatage sécurisé de la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return '';
    }
  };

  return (
    <div className="regulation-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '8px', 
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {String(regulation.titre || 'Sans titre')}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} />
              {String(regulation.domaine || 'Non défini')}
            </span>
            {regulation.deadline && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                {formatDate(regulation.deadline)}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="action-btn action-btn-view"
            onClick={(e) => {
              e.stopPropagation();
              console.log('View', regulation);
            }}
          >
            <Eye size={16} />
          </button>
          <button 
            className="action-btn action-btn-edit"
            onClick={(e) => {
              e.stopPropagation();
              if (onEditAudit) onEditAudit(regulation);
            }}
          >
            <Edit3 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px', 
          fontWeight: '500',
          color: statusColors.text,
          backgroundColor: statusColors.bg,
          border: `1px solid ${statusColors.border}`
        }}>
          {String(regulation.conformite || 'Non audité')}
        </span>
        {regulation.risque && (
          <span style={{ fontSize: '14px', fontWeight: '500', color: getRiskColor(regulation.risque) }}>
            Risque {String(regulation.risque)}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Progression</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{progress}%</span>
        </div>
        <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '8px', 
              borderRadius: '10px',
              backgroundColor: progress === 100 ? '#10b981' : progress > 50 ? '#3b82f6' : '#f59e0b',
              width: `${progress}%`,
              transition: 'width 0.5s ease'
            }}
          />
        </div>
      </div>

      {regulation.owner && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
          <User size={14} />
          <span>{String(regulation.owner)}</span>
        </div>
      )}
    </div>
  );
};

const ModernAuditDashboard = ({ 
  dashboardStats = null, 
  regulations = [], 
  loading = false, 
  onToggleUI,
  onEditAudit 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // S'assurer que regulations est un tableau
  const safeRegulations = Array.isArray(regulations) ? regulations : [];
  
  // Utiliser les vraies données ou des valeurs par défaut
  const stats = dashboardStats || {
    totaux: { 
      reglementations: 0, 
      audits: 0, 
      taux_audit: 0 
    },
    conformite: [
      { conformite: 'Conforme', count: 0, color: '#10B981' },
      { conformite: 'Non Conforme', count: 0, color: '#EF4444' },
      { conformite: 'En Cours', count: 0, color: '#F59E0B' }
    ],
    echeances_proches: 0
  };

  const filteredRegulations = safeRegulations.filter(reg => {
    if (!reg || typeof reg !== 'object') return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (reg.titre && reg.titre.toLowerCase().includes(searchLower)) ||
      (reg.domaine && reg.domaine.toLowerCase().includes(searchLower)) ||
      (reg.owner && reg.owner.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="modern-dashboard">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div className="loading-spinner"></div>
          <p style={{ color: '#6b7280' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Header moderne */}
      <header className="modern-header">
        <div className="modern-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-menu-btn"
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="logo-container">
                <Shield className="logo-icon" size={24} />
              </div>
              <div>
                <h1 className="logo-title">SafeNext</h1>
                <p className="logo-subtitle">Audit & Conformité</p>
              </div>
            </div>
          </div>

          <nav className="modern-nav">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { key: 'regulations', label: 'Réglementations', icon: FileText },
              { key: 'reports', label: 'Rapports', icon: PieChart },
              { key: 'settings', label: 'Paramètres', icon: Settings }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`nav-button ${activeTab === tab.key ? 'nav-button-active' : ''}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onToggleUI && (
              <button 
                onClick={onToggleUI}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} />
                Interface classique
              </button>
            )}
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">2</span>
            </button>
            <div className="user-avatar">AD</div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="modern-main">
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            {/* En-tête du dashboard */}
            <div className="dashboard-header">
              <div>
                <h2 className="dashboard-title">Tableau de bord</h2>
                <p className="dashboard-subtitle">
                  Vue d'ensemble de votre conformité réglementaire
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn-secondary">
                  <Download size={16} />
                  <span>Exporter</span>
                </button>
                <button className="btn-primary">
                  <Plus size={16} />
                  <span>Nouvel audit</span>
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="stats-grid">
              <StatCard
                title="Réglementations"
                value={Number(stats.totaux?.reglementations || 0)}
                icon={FileText}
                change="+12"
                trend="up"
                color="blue"
              />
              <StatCard
                title="Audits Réalisés"
                value={Number(stats.totaux?.audits || 0)}
                icon={CheckCircle2}
                change="+8"
                trend="up"
                color="green"
              />
              <StatCard
                title="Taux d'Audit"
                value={`${Number(stats.totaux?.taux_audit || 0)}%`}
                icon={TrendingUp}
                change="+5"
                trend="up"
                color="purple"
              />
              <StatCard
                title="Échéances Proches"
                value={Number(stats.echeances_proches || 0)}
                icon={AlertTriangle}
                change="-3"
                trend="down"
                color="amber"
              />
            </div>

            {/* Actions rapides */}
            <div className="card-modern">
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                Actions rapides
              </h3>
              <div className="quick-actions-grid">
                <QuickActionCard
                  title="Créer un audit"
                  description="Lancer un nouveau processus d'audit"
                  icon={Plus}
                  color="blue"
                  onClick={() => console.log('Créer un audit')}
                />
                <QuickActionCard
                  title="Générer un rapport"
                  description="Créer un rapport de conformité"
                  icon={FileText}
                  color="purple"
                  onClick={() => console.log('Générer un rapport')}
                />
                <QuickActionCard
                  title="Planifier une revue"
                  description="Programmer une révision périodique"
                  icon={Calendar}
                  color="green"
                  onClick={() => console.log('Planifier une revue')}
                />
              </div>
            </div>

            {/* Réglementations récentes */}
            {safeRegulations.length > 0 && (
              <div className="card-modern">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                    Audits récents
                  </h3>
                  <button 
                    className="link-button"
                    onClick={() => setActiveTab('regulations')}
                  >
                    Voir tout
                  </button>
                </div>
                <div className="regulations-grid">
                  {safeRegulations.slice(0, 6).map((regulation, index) => (
                    <RegulationCard 
                      key={regulation.id || `regulation-${index}`} 
                      regulation={regulation}
                      onEditAudit={onEditAudit}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Graphique de conformité */}
            <div className="card-modern">
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                Répartition de la conformité
              </h3>
              <div className="conformity-chart">
                {Array.isArray(stats.conformite) && stats.conformite.map((item, index) => (
                  <div key={index} className="conformity-item">
                    <div 
                      className="conformity-circle"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <span style={{ color: item.color, fontSize: '24px', fontWeight: 'bold' }}>
                        {Number(item.count || 0)}
                      </span>
                    </div>
                    <h4 style={{ fontWeight: '600', color: '#111827', margin: '12px 0 4px 0' }}>
                      {String(item.conformite)}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {stats.totaux?.audits > 0 ? Math.round((item.count / stats.totaux.audits) * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'regulations' && (
          <div className="regulations-content">
            <div className="regulations-header">
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                Réglementations
              </h2>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div className="search-container">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-secondary">
                  <Filter size={16} />
                  Filtres
                </button>
              </div>
            </div>

            <div className="regulations-grid">
              {filteredRegulations.map((regulation, index) => (
                <RegulationCard 
                  key={regulation.id || `filtered-regulation-${index}`} 
                  regulation={regulation}
                  onEditAudit={onEditAudit}
                />
              ))}
            </div>

            {filteredRegulations.length === 0 && (
              <div className="empty-state">
                <FileText size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                <h3 style={{ color: '#374151', marginBottom: '8px' }}>Aucune réglementation trouvée</h3>
                <p style={{ color: '#6b7280' }}>
                  {searchTerm ? 'Essayez de modifier votre recherche' : 'Aucune donnée disponible'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModernAuditDashboard;