import React from 'react';
import { Eye, Edit, FileText } from 'lucide-react';

const RegulationRow = ({ regulation, onEditAudit }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Conforme': return 'conforme';
      case 'Non Conforme': return 'non-conforme';
      case 'Non Applicable': return 'non-applicable';
      default: return 'default';
    }
  };

  const getRiskClass = (risk) => {
    switch (risk) {
      case 'Élevé': return 'eleve';
      case 'Moyen': return 'moyen';
      case 'Faible': return 'faible';
      default: return 'default';
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEditAudit(regulation);
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement view functionality
    console.log('View regulation:', regulation);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <tr key={regulation.id}>
      <td>
        <div>
          <div className="audit-regulation-title">
            {regulation.titre || 'Sans titre'}
          </div>
          {regulation.exigence && (
            <div className="audit-regulation-description">
              {truncateText(regulation.exigence, 150)}
            </div>
          )}
          {regulation.chapitre && (
            <div className="audit-regulation-chapter">
              Ch. {regulation.chapitre} 
              {regulation.sous_chapitre && ` - ${regulation.sous_chapitre}`}
            </div>
          )}
        </div>
      </td>
      
      <td>
        <span className="audit-domain-badge">
          {regulation.domaine || 'Non défini'}
        </span>
      </td>
      
      <td>
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          {regulation.chapitre || '-'}
        </span>
      </td>
      
      <td>
        <span className={`audit-status-badge ${getStatusClass(regulation.conformite)}`}>
          {regulation.conformite || 'Non audité'}
        </span>
      </td>
      
      <td>
        {regulation.risque ? (
          <span className={`audit-risk-badge ${getRiskClass(regulation.risque)}`}>
            {regulation.risque}
          </span>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
        )}
      </td>
      
      <td>
        {regulation.owner ? (
          <div className="audit-user-avatar">
            <div className="audit-user-avatar-circle">
              {regulation.owner.charAt(0).toUpperCase()}
            </div>
            <span className="audit-user-name">{regulation.owner}</span>
          </div>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Non assigné</span>
        )}
      </td>
      
      <td>
        {regulation.deadline ? (
          <span style={{ fontSize: '0.875rem' }}>
            {new Date(regulation.deadline).toLocaleDateString('fr-FR')}
          </span>
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
        )}
      </td>
      
      <td>
        <div className="audit-actions">
          <button
            onClick={handleEditClick}
            className="audit-action-button edit"
            title="Modifier l'audit"
            type="button"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleViewClick}
            className="audit-action-button view"
            title="Voir les détails"
            type="button"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const EmptyState = () => (
  <div className="audit-empty-state">
    <FileText size={48} className="audit-empty-icon" />
    <p className="audit-empty-title">Aucune réglementation trouvée</p>
    <p className="audit-empty-description">
      Essayez de modifier vos critères de recherche ou vérifiez vos filtres
    </p>
  </div>
);

const RegulationsTable = ({ regulations, onEditAudit }) => {
  if (!Array.isArray(regulations)) {
    return (
      <div className="audit-card">
        <h3 className="audit-chart-title">Liste des Réglementations (0)</h3>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="audit-card">
      <h3 className="audit-chart-title">
        Liste des Réglementations ({regulations.length})
      </h3>
      
      {regulations.length === 0 ? (
        <EmptyState />
      ) : (
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
              {regulations.map((regulation) => (
                <RegulationRow
                  key={regulation.id || `reg-${Math.random()}`}
                  regulation={regulation}
                  onEditAudit={onEditAudit}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegulationsTable;