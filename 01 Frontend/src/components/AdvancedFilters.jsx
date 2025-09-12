import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterIcon, FolderIcon, CheckCircleIcon, TrendingUpIcon, UserIcon, CalendarIcon } from "../icons/icon"; 
import Button from "./ui/Button";
import Label from "./ui/Label";
import StatusBadge from "./ui/StatusBadge";

// Composant Advanced Filters avec domaine intégré
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
      domaines: [...new Set(regulations.map(r => r.domaine).filter(Boolean))].sort(),
      statuts: [...new Set(regulations.map(r => r.conformite).filter(Boolean))],
      prioritées: [...new Set(regulations.map(r => r.prioritée).filter(Boolean))],
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
      <div className="p-1">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              {/* Filtre par domaine */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <FolderIcon className="h-4 w-4" />
                  <span>Domaine</span>
                </Label>
                <select
                  value={filters.domaine}
                  onChange={(e) => onFilterChange('domaine', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Tous les domaines</option>
                  {uniqueValues.domaines.map(domaine => (
                    <option key={domaine} value={domaine}>{domaine}</option>
                  ))}
                </select>
              </div>

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

              {/* Filtre par prioritée */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <TrendingUpIcon className="h-4 w-4" />
                  <span>Priorité</span>
                </Label>
                <select
                  value={filters.prioritée}
                  onChange={(e) => onFilterChange('prioritée', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Toutes les priorités</option>
                  {uniqueValues.prioritées.map(prioritée => (
                    <option key={prioritée} value={prioritée}>{prioritée}</option>
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
export default AdvancedFilters;