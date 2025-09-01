import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE = 'http://localhost:3001/api';

/**
 * Hook personnalisé pour gérer les données d'audit
 * @param {string} searchTerm - Terme de recherche
 * @param {string} selectedDomain - Domaine sélectionné
 * @returns {Object} - Objet contenant les données et fonctions d'audit
 */
export const useAuditData = (searchTerm, selectedDomain) => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [regulations, setRegulations] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fonction utilitaire pour gérer les erreurs d'API
  const handleApiError = useCallback((error, operation) => {
    console.error(`Erreur lors de ${operation}:`, error);
    setError(`Erreur lors de ${operation}: ${error.message}`);
    return false;
  }, []);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardStats(data);
      return true;
    } catch (error) {
      return handleApiError(error, 'chargement des statistiques');
    }
  }, [handleApiError]);

  // Fetch regulations
  const fetchRegulations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/reglementation`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Validation et nettoyage des données
      const cleanedData = Array.isArray(data) ? data.filter(reg => reg && typeof reg === 'object') : [];
      setRegulations(cleanedData);
      return true;
    } catch (error) {
      setRegulations([]);
      return handleApiError(error, 'chargement des réglementations');
    }
  }, [handleApiError]);

  // Fetch domains
  const fetchDomains = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/reglementation/domaines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Validation des données de domaines
      const cleanedDomains = Array.isArray(data) ? data.filter(domain => domain && domain.domaine) : [];
      setDomains(cleanedDomains);
      return true;
    } catch (error) {
      setDomains([]);
      return handleApiError(error, 'chargement des domaines');
    }
  }, [handleApiError]);

  // Save audit
  const saveAudit = useCallback(async (reglementationId, auditData) => {
    if (isSaving || !reglementationId || !auditData) return false;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Validation des données avant envoi
      const cleanedData = {
        reglementation_id: reglementationId,
        conformite: auditData.conformite?.trim() || '',
        risque: auditData.risque?.trim() || '',
        faisabilite: auditData.faisabilite?.trim() || '',
        plan_action: auditData.plan_action?.trim() || '',
        deadline: auditData.deadline || null,
        owner: auditData.owner?.trim() || ''
      };

      if (!cleanedData.conformite) {
        throw new Error('La conformité est obligatoire');
      }

      console.log('Sauvegarde en cours...', cleanedData);
      
      const response = await fetch(`${API_BASE}/audit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Audit sauvegardé:', result);
        
        // Mettre à jour les données localement
        setRegulations(prev => prev.map(reg => 
          reg.id === reglementationId 
            ? { ...reg, ...cleanedData }
            : reg
        ));
        
        // Rafraîchir les données
        await Promise.all([
          fetchRegulations(),
          fetchDashboardStats()
        ]);
        
        alert('Audit sauvegardé avec succès !');
        return true;
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      handleApiError(error, 'sauvegarde de l\'audit');
      alert(`Erreur lors de la sauvegarde: ${error.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, fetchRegulations, fetchDashboardStats, handleApiError]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.allSettled([
        fetchDashboardStats(),
        fetchRegulations(),
        fetchDomains()
      ]);
      
      // Vérifier s'il y a eu des erreurs
      const hasErrors = results.some(result => result.status === 'rejected');
      if (hasErrors) {
        console.warn('Certaines données n\'ont pas pu être chargées');
      }
      
    } catch (error) {
      handleApiError(error, 'rechargement des données');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats, fetchRegulations, fetchDomains, handleApiError]);

  // Filtrage mémorisé des réglementations avec amélioration de la recherche
  const filteredRegulations = useMemo(() => {
    if (!Array.isArray(regulations)) return [];
    
    let filtered = [...regulations];
    
    // Filtre de recherche amélioré
    if (searchTerm && searchTerm.trim()) {
      const searchTermLower = searchTerm.trim().toLowerCase();
      const searchWords = searchTermLower.split(/\s+/).filter(word => word.length > 0);
      
      filtered = filtered.filter(reg => {
        if (!reg) return false;
        
        const searchableText = [
          reg.titre,
          reg.exigence,
          reg.domaine,
          reg.chapitre,
          reg.sous_chapitre,
          reg.conformite,
          reg.owner
        ].filter(Boolean).join(' ').toLowerCase();
        
        // Recherche de tous les mots (AND logic)
        return searchWords.every(word => searchableText.includes(word));
      });
    }
    
    // Filtre par domaine
    if (selectedDomain && selectedDomain.trim()) {
      filtered = filtered.filter(reg => reg && reg.domaine === selectedDomain);
    }
    
    return filtered;
  }, [searchTerm, selectedDomain, regulations]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    dashboardStats,
    regulations,
    domains,
    loading,
    isSaving,
    error,
    filteredRegulations,
    saveAudit,
    refreshData,
    fetchDashboardStats,
    fetchRegulations,
    fetchDomains
  };
};

export default useAuditData;