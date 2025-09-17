import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant, size, className }) => {
  const baseStyle = "font-semibold rounded-full transform transition-transform duration-200 active:scale-95";
  const variants = {
    outline: "bg-white/50 border border-gray-200 text-gray-800 hover:bg-gray-100",
    solid: "bg-blue-500 text-white hover:bg-blue-600",
  };
  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const StatusBadge = ({ children, status, className }) => {
  const baseStyle = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const statuses = {
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    neutral: "bg-gray-100 text-gray-800",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`${baseStyle} ${statuses[status]} ${className}`}>
      {children}
    </span>
  );
};

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.536-1.636-1.636a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);
const AlertCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2.003 4.103-2.003 5.258 0L21.62 16.002c1.155 2.003-.346 4.5-2.62 4.5H5.002c-2.274 0-3.775-2.497-2.62-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm.002 6.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" clipRule="evenodd" />
  </svg>
);
const TrendingUpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06L14.03 21.03a.75.75 0 0 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);
const UserIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.73 0-5.41-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);
const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM7.5 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM7.5 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM16.5 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM16.5 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM18.75 3a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V5.25A2.25 2.25 0 0 1 3.75 3H6a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 0-.75.75v12a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75H18a.75.75 0 0 1 0-1.5h.75ZM12 6a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H12.75A.75.75 0 0 1 12 6ZM12 3a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H12.75A.75.75 0 0 1 12 3Z" />
  </svg>
);

const TableView = ({ filteredRegulations, isFullscreen, handleStartAudit }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedRegulations = [...filteredRegulations].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle null or undefined values gracefully
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;

      // Special case for deadline to sort by date
      if (sortConfig.key === 'deadline') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      
      // Default string comparison for other keys
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue.toLowerCase() < bValue.toLowerCase()) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue.toLowerCase() > bValue.toLowerCase()) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const commonHeaderProps = "px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer select-none transition-colors duration-200 hover:text-blue-600";
  const commonHeaderStyle = "flex items-center space-x-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
    >
      <div className={`overflow-x-auto ${isFullscreen ? 'max-h-[calc(100vh-120px)]' : 'max-h-[calc(100vh-140px)]'} overflow-y-auto`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className={`${commonHeaderProps} w-40`} onClick={() => requestSort('domaine')}>
                <div className={commonHeaderStyle}>
                  <span>Domaine</span>
                  <span className="text-gray-400">{getSortIndicator('domaine')}</span>
                </div>
              </th>
              <th className={`${commonHeaderProps} min-w-[200px]`} onClick={() => requestSort('titre')}>
                <div className={commonHeaderStyle}>
                  <span>Titre</span>
                  <span className="text-gray-400">{getSortIndicator('titre')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[400px]">Exigence</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[400px]">Références légales</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[400px]">Documents légaux</th>              
              <th className={`${commonHeaderProps} w-32`} onClick={() => requestSort('conformite')}>
                <div className={commonHeaderStyle}>
                  <span>Statut</span>
                  <span className="text-gray-400">{getSortIndicator('conformite')}</span>
                </div>
              </th>
              <th className={`${commonHeaderProps} w-32`} onClick={() => requestSort('prioritée')}>
                <div className={commonHeaderStyle}>
                  <span>Priorité</span>
                  <span className="text-gray-400">{getSortIndicator('prioritée')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[300px]">Plan d'actions</th>
              <th className={`${commonHeaderProps} w-40`} onClick={() => requestSort('owner')}>
                <div className={commonHeaderStyle}>
                  <span>Propriétaire</span>
                  <span className="text-gray-400">{getSortIndicator('owner')}</span>
                </div>
              </th>
              <th className={`${commonHeaderProps} w-32`} onClick={() => requestSort('deadline')}>
                <div className={commonHeaderStyle}>
                  <span>Échéance</span>
                  <span className="text-gray-400">{getSortIndicator('deadline')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
            {sortedRegulations.map((regulation, index) => (
              <motion.tr
                key={regulation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`transition-all duration-200 hover:bg-blue-50/50 cursor-pointer group border-l-4 border-transparent hover:border-blue-400 ${
                  index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                }`}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                    <span className="font-semibold" title={regulation.domaine || 'Non défini'}>
                      {regulation.domaine || 'Non défini'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <p className="font-semibold line-clamp-2 cursor-help group-hover:text-blue-700 transition-colors leading-snug" title={regulation.titre || 'Titre non défini'}>
                    {regulation.titre || 'Titre non défini'}
                  </p>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <p className="line-clamp-4 cursor-help leading-snug" title={regulation.exigence || 'Aucune exigence définie'}>
                    {regulation.exigence || 'Aucune exigence définie'}
                  </p>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <p className="line-clamp-4 cursor-help leading-snug" title={regulation.lois || 'Aucune référence légale définie'}>
                    {regulation.lois || 'Aucune référence légale définie'}
                  </p>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <p className="line-clamp-4 cursor-help leading-snug" title={regulation.documents || 'Aucune référence légale définie'}>
                    {regulation.documents || 'Aucun document légal est exigé'}
                  </p>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {regulation.conformite ? (
                    <StatusBadge 
                      status={regulation.conformite === 'Conforme' ? 'success' : regulation.conformite === 'Non conforme' ? 'danger' : 'warning'}
                      className="shadow-sm flex items-center space-x-1"
                    >
                      {regulation.conformite === 'Conforme' && <CheckCircleIcon className="h-3 w-3" />}
                      {regulation.conformite === 'Non conforme' && <AlertCircleIcon className="h-3 w-3" />}
                      <span>{regulation.conformite}</span>
                    </StatusBadge>
                  ) : (
                    <StatusBadge status="neutral" className="border-dashed flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                      <span>En attente</span>
                    </StatusBadge>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {regulation.prioritée ? (
                    <StatusBadge 
                      status={regulation.prioritée === 'Critique' ? 'danger' : regulation.prioritée === 'Élevée' ? 'warning' : 'success'}
                      className="shadow-sm flex items-center space-x-1"
                    >
                      <TrendingUpIcon className="h-3 w-3" />
                      <span>{regulation.prioritée}</span>
                    </StatusBadge>
                  ) : (
                    <span className="text-gray-400 italic text-xs">Non assigné</span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {regulation.plan_action ? (
                    <p className="line-clamp-3 leading-snug">
                      {regulation.plan_action}
                    </p>
                  ) : (
                    <span className="text-gray-400 italic text-xs">Non défini</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {regulation.owner ? (
                    <StatusBadge 
                      status="neutral"
                      className="shadow-sm flex items-center space-x-1"
                    >
                      <UserIcon className="h-3 w-3" />
                      <span>{regulation.owner}</span>
                    </StatusBadge>
                  ) : (
                    <span className="text-gray-400 italic text-xs">Non assigné</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {regulation.deadline ? (
                    <StatusBadge 
                      status={new Date(regulation.deadline) < new Date() ? 'danger' : 'info'}
                      className="flex items-center space-x-1"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      <span>{new Date(regulation.deadline).toLocaleDateString()}</span>
                    </StatusBadge>
                  ) : (
                    <span className="text-gray-400 italic text-xs">Non définie</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <Button
                    onClick={() => handleStartAudit(regulation)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                  >
                    {regulation.conformite ? 'Modifier' : 'Auditer'}
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TableView;