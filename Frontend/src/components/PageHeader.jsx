import React from 'react';
import { motion } from 'framer-motion';
import { Maximize, Minimize } from "lucide-react";
import { Button, Input, StatusBadge } from "../components/ui/componentsui";
import { SearchIcon, XIcon, GridIcon, TableIcon } from "../icons/icon";
import { Link } from "react-router-dom";
import SummaryDashboard from "../components/SummaryDashboard";
import AdvancedFilters from "../components/AdvancedFilters.jsx";
import ReportButton from "../components/ReportButton.jsx";

const PageHeader = ({
  filteredRegulations,
  filters,
  searchTerm,
  setSearchTerm,
  isFullscreen,
  toggleFullscreen,
  viewMode,
  setViewMode,
  handleFilterChange,
  handleResetFilters,
  regulations,
  onReportClick
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-4 py-2 shadow-sm"
    >
      <div className="space-y-4">
        {/* Title + Quick Links + Search Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
          
          {/* Left section: links + counter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-4"
          >
            {/* Quick links */}
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:underline transition-colors"
              >
                Accueil
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                to="/recap"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:underline transition-colors"
              >
                Récapitulatif
              </Link>
            </div>

            {/* Counter */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 flex items-center space-x-2 text-sm"
            >
              <span className="flex items-center space-x-1">
                <span className={`inline-block w-2 h-2 rounded-full ${filteredRegulations.length > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                <span className="font-medium">{filteredRegulations.length}</span>
                <span>réglementation{filteredRegulations.length > 1 ? 's' : ''}</span>
              </span>
              {filters.domaine && (
                <>
                  <span className="text-gray-400">•</span>
                  <StatusBadge status="info" size="sm">{filters.domaine}</StatusBadge>
                </>
              )}
            </motion.p>
          </motion.div>

          {/* Right section: search + buttons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3"
          >
            {/* Barre de recherche */}
            <div className="relative flex-1 sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Bouton rapport */}
            <ReportButton
              type="reglementation"
              filters={filters}
              size="sm"
              onClick={onReportClick}
            >
               Rapport
            </ReportButton>

            {/* Toggle view mode */}
            <div className="flex bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <GridIcon className="h-3 w-3" />
                <span>Cartes</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-xs font-medium transition-all duration-200 flex items-center space-x-1 border-l border-gray-200 ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <TableIcon className="h-3 w-3" />
                <span>Tableau</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          regulations={regulations}
        />

        {/* Summary Dashboard */}
        <SummaryDashboard regulations={filteredRegulations} />
      </div>
    </motion.div>
  );
};

export default PageHeader;
