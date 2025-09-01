import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, Clock, FileText, TrendingUp
} from 'lucide-react';

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

const StatCard = ({ title, value, icon: Icon, className, iconColor, textColor }) => (
  <div className={`audit-stat-card ${className}`}>
    <div className="audit-stat-card-content">
      <div>
        <h3 className="audit-stat-title" style={{ color: textColor }}>
          {title}
        </h3>
        <p className="audit-stat-value">
          {value}
        </p>
      </div>
      <Icon size={32} style={{ color: iconColor }} />
    </div>
  </div>
);

const ConformityChart = ({ data }) => (
  <div className="audit-card">
    <h3 className="audit-chart-title">Répartition par Conformité</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data || []}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          label={({conformite, count}) => `${conformite}: ${count}`}
        >
          {(data || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const DomainsChart = ({ data }) => (
  <div className="audit-card">
    <h3 className="audit-chart-title">Audits par Domaine</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data?.slice(0, 10) || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="domaine" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="audites" fill={COLORS.primary} radius={[, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const UpcomingDeadlines = ({ deadlines }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Conforme': return 'conforme';
      case 'Non Conforme': return 'non-conforme';
      case 'En Cours': return 'en-cours';
      default: return 'default';
    }
  };

  if (!deadlines?.length) return null;

  return (
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
            {deadlines.map((item, index) => (
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
  );
};

const DashboardStats = ({ dashboardStats, onRefresh }) => {
  if (!dashboardStats) {
    return (
      <div className="audit-dashboard-content">
        <div className="audit-empty-state">
          <FileText size={48} className="audit-empty-icon" />
          <p className="audit-empty-title">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-dashboard-content">
      {/* Stats Cards */}
      <div className="audit-stats-grid">
        <StatCard
          title="Réglementations"
          value={dashboardStats.totaux?.reglementations || 0}
          icon={FileText}
          className="primary"
          iconColor="rgba(219, 234, 254, 0.6)"
          textColor="rgba(219, 234, 254, 0.8)"
        />
        
        <StatCard
          title="Audits Réalisés"
          value={dashboardStats.totaux?.audits || 0}
          icon={CheckCircle}
          className="success"
          iconColor="rgba(236, 253, 245, 0.6)"
          textColor="rgba(236, 253, 245, 0.8)"
        />
        
        <StatCard
          title="Taux d'Audit"
          value={`${dashboardStats.totaux?.taux_audit || 0}%`}
          icon={TrendingUp}
          className="purple"
          iconColor="rgba(245, 243, 255, 0.6)"
          textColor="rgba(245, 243, 255, 0.8)"
        />
        
        <StatCard
          title="Échéances Proches"
          value={dashboardStats.echeances_proches?.length || 0}
          icon={Clock}
          className="warning"
          iconColor="rgba(255, 251, 235, 0.6)"
          textColor="rgba(255, 251, 235, 0.8)"
        />
      </div>

      {/* Charts */}
      <div className="audit-charts-grid">
        <ConformityChart data={dashboardStats.conformite} />
        <DomainsChart data={dashboardStats.domaines} />
      </div>

      {/* Upcoming Deadlines */}
      <UpcomingDeadlines deadlines={dashboardStats.echeances_proches} />
    </div>
  );
};

export default DashboardStats;