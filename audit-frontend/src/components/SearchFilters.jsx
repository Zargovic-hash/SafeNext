import React from 'react';
import { Search, Download } from 'lucide-react';

const SearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedDomain, 
  onDomainChange, 
  domains, 
  onExport,
  resultsCount 
}) => {
  const handleSearchChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSearchChange(e.target.value);
  };

  const handleDomainChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDomainChange(e.target.value);
  };

  const handleExportClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onExport();
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSearchChange('');
    onDomainChange('');
  };

  return (
    <div className="audit-card">
      <div className="audit-filter-grid">
        <div className="audit-search-container">
          <Search size={20} className="audit-search-icon" />
          <input
            type="text"
            placeholder="Rechercher par titre, exigence ou domaine..."
            className="audit-input audit-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSearchChange('');
              }}
              className="audit-search-clear"
              title="Effacer la recherche"
            >
              ×
            </button>
          )}
        </div>
        
        <select
          className="audit-input"
          value={selectedDomain}
          onChange={handleDomainChange}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
        >
          <option value="">Tous les domaines</option>
          {domains.map((domain, index) => (
            <option key={`${domain.domaine}-${index}`} value={domain.domaine}>
              {domain.domaine}
            </option>
          ))}
        </select>
        
        <div className="audit-filter-actions">
          {(searchTerm || selectedDomain) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="audit-button secondary"
            >
              Effacer filtres
            </button>
          )}
          
          <button
            type="button"
            onClick={handleExportClick}
            className="audit-button primary"
            disabled={resultsCount === 0}
            title={resultsCount === 0 ? 'Aucune donnée à exporter' : 'Exporter les résultats au format CSV'}
          >
            <Download size={16} />
            Export CSV ({resultsCount})
          </button>
        </div>
      </div>
      
      {(searchTerm || selectedDomain) && (
        <div className="audit-filter-summary">
          <span className="audit-filter-info">
            {resultsCount} résultat{resultsCount > 1 ? 's' : ''} trouvé{resultsCount > 1 ? 's' : ''}
            {searchTerm && (
              <span className="audit-filter-term">
                pour "{searchTerm}"
              </span>
            )}
            {selectedDomain && (
              <span className="audit-filter-domain">
                dans {selectedDomain}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;