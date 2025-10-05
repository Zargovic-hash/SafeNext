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
  className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
>
  <div className="max-w-full px-4 sm:px-6 py-4 space-y-4">
    {/* Title + Quick Links + Search Section */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
      
      {/* Left section: links + counter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 sm:gap-6"
      >
        {/* Quick links */}
        <nav className="flex items-center gap-1 text-sm flex-wrap">
          <Link
            to="/"
            className="px-2 py-1 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Accueil
          </Link>
          <span className="text-gray-400 hidden sm:inline">/</span>
          <Link
            to="/recap"
            className="px-2 py-1 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Récapitulatif
          </Link>
        </nav>

        {/* Counter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-default"
          >
            <motion.div 
              animate={{ 
                scale: filteredRegulations.length > 0 ? [1, 1.2, 1] : 1,
              }}
              transition={{ 
                repeat: filteredRegulations.length > 0 ? Infinity : 0, 
                duration: 2 
              }}
              className={`w-2 h-2 rounded-full ${filteredRegulations.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}
            ></motion.div>
            <span className="text-sm font-semibold text-gray-900">{filteredRegulations.length}</span>
            <span className="text-sm text-gray-600">
              réglementation{filteredRegulations.length > 1 ? 's' : ''}
            </span>
          </motion.div>
          {filters.domaine && (
            <StatusBadge status="info" size="sm">{filters.domaine}</StatusBadge>
          )}
        </motion.div>
      </motion.div>

      {/* Right section: search + buttons */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-2 sm:gap-3"
      >
        {/* Search bar */}
        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className={`h-4 w-4 transition-colors ${searchTerm ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
          </div>
          <Input
            placeholder="Rechercher une réglementation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg group-hover:border-gray-400"
          />
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        {/* Report button */}
        <ReportButton
          type="reglementation"
          filters={filters}
          size="sm"
          onClick={onReportClick}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
        >
          Rapport
        </ReportButton>

        {/* View mode toggle */}
        <div className="w-full sm:w-auto relative inline-flex items-center bg-gray-100 rounded-lg p-1 mt-2 sm:mt-0">
          <motion.div
            layoutId="activeViewMode"
            className="absolute inset-y-1 bg-white rounded-md shadow-sm"
            style={{
              left: viewMode === 'cards' ? '0.25rem' : 'calc(50%)',
              width: 'calc(50% - 0.25rem)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setViewMode('cards')}
            className={`relative z-10 flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              viewMode === 'cards' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GridIcon className="h-4 w-4" />
            <span>Cartes</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`relative z-10 flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              viewMode === 'table' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TableIcon className="h-4 w-4" />
            <span>Tableau</span>
          </button>
        </div>
      </motion.div>
    </div>

    {/* Advanced Filters */}
    <div className="overflow-x-auto">
      <AdvancedFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        regulations={regulations}
      />
    </div>

    {/* Summary Dashboard */}
    <div className="overflow-x-auto">
      <SummaryDashboard regulations={filteredRegulations} />
    </div>
  </div>
</motion.div>

  );
};

export default PageHeader;