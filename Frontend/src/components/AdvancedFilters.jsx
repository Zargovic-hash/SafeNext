import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FilterIcon, 
  FolderIcon, 
  CheckCircleIcon, 
  TrendingUpIcon, 
  UserIcon, 
  CalendarIcon 
} from "../icons/icon"; 
import Button from "./ui/Button";
import Label from "./ui/Label";
import StatusBadge from "./ui/StatusBadge";

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
      className={`bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm p-3 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1.5 text-gray-700 hover:text-blue-600 text-sm font-medium"
        >
          <FilterIcon className="h-4 w-4 text-blue-500" />
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <StatusBadge status="info" className="ml-1">
              {activeFiltersCount}
            </StatusBadge>
          )}
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="h-3.5 w-3.5 text-gray-400"
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
            size="xs"
            onClick={onResetFilters}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50 border-gray-300 text-xs px-2 py-1 rounded-md"
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
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            {/* Exemple : Filtre domaine */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <FolderIcon className="h-3.5 w-3.5 text-blue-500" />
                Domaine
              </Label>
              <select
                value={filters.domaine}
                onChange={(e) => onFilterChange('domaine', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tous</option>
                {uniqueValues.domaines.map(domaine => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" />
                Statut
              </Label>
              <select
                value={filters.statut}
                onChange={(e) => onFilterChange('statut', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="">Tous</option>
                {uniqueValues.statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
            </div>

            {/* Priorité */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <TrendingUpIcon className="h-3.5 w-3.5 text-orange-500" />
                Priorité
              </Label>
              <select
                value={filters.prioritée}
                onChange={(e) => onFilterChange('prioritée', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">Toutes</option>
                {uniqueValues.prioritées.map(prioritée => (
                  <option key={prioritée} value={prioritée}>{prioritée}</option>
                ))}
              </select>
            </div>

            {/* Propriétaire */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5 text-purple-500" />
                Propriétaire
              </Label>
              <select
                value={filters.owner}
                onChange={(e) => onFilterChange('owner', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                <option value="">Tous</option>
                {uniqueValues.owners.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
            </div>

            {/* Échéances */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5 text-red-500" />
                Échéances
              </Label>
              <select
                value={filters.deadlineProche}
                onChange={(e) => onFilterChange('deadlineProche', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="">Toutes</option>
                <option value="7">7 jours</option>
                <option value="30">30 jours</option>
                <option value="90">90 jours</option>
                <option value="expired">Échues</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedFilters;
