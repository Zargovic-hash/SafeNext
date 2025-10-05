import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// --- Reusable Components (Button, StatusBadge, Icons) ---

const Button = ({ children, onClick, variant, size, className, ...props }) => {
  const baseStyle = "font-semibold rounded-xl transform transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-lg";
  const variants = {
    outline: "bg-gradient-to-r from-white/90 to-gray-50/90 border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:from-blue-50/90 hover:to-white/90 hover:text-blue-700 focus:ring-blue-500/50 backdrop-blur-sm",
    solid: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/50",
    ghost: "text-gray-600 hover:bg-gray-100/70 focus:ring-gray-300/50",
  };
  const sizes = {
    sm: "px-4 py-2 text-xs font-medium",
    md: "px-6 py-2.5 text-sm font-medium",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.solid} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const StatusBadge = ({ children, status, className }) => {
  const baseStyle = "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur-sm border transition-all duration-300 hover:scale-105";
  const statuses = {
    success: "bg-gradient-to-r from-emerald-100/90 to-green-100/90 text-emerald-800 border-emerald-200 shadow-emerald-200/50",
    danger: "bg-gradient-to-r from-red-100/90 to-rose-100/90 text-red-800 border-red-200 shadow-red-200/50",
    warning: "bg-gradient-to-r from-amber-100/90 to-yellow-100/90 text-amber-800 border-amber-200 shadow-amber-200/50",
    neutral: "bg-gradient-to-r from-gray-100/90 to-slate-100/90 text-gray-700 border-gray-200 shadow-gray-200/50",
    info: "bg-gradient-to-r from-blue-100/90 to-indigo-100/90 text-blue-800 border-blue-200 shadow-blue-200/50",
  };
  return (
    <span className={`${baseStyle} ${statuses[status]} ${className}`}>
      {children}
    </span>
  );
};

// Icons (CheckCircleIcon, AlertCircleIcon, TrendingUpIcon, UserIcon, CalendarIcon)
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
    <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 0 1 .968-.432l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.973l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" clipRule="evenodd" />
  </svg>
);

const UserIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.73 0-5.41-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 21l4.5-4.5 4.5 4.5" />
  </svg>
);

// --- Component: ColumnViewSelector ---

const ViewOption = ({ name, isActive, onClick }) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'solid' : 'ghost'}
    size="sm"
    className={`
      min-w-[120px] justify-center text-center !rounded-lg
      ${isActive ? 'shadow-blue-500/50' : 'hover:!bg-blue-50/70 text-gray-700'}
    `}
  >
    {name}
  </Button>
);

const ColumnViewSelector = ({ activeView, setActiveView }) => {
  const views = useMemo(() => [
    { id: 'compliance', name: 'Conformité' },
    { id: 'action_plan', name: 'Plan d\'Actions' },
    { id: 'references', name: 'Références' },
    { id: 'full', name: 'Vue Complète' },
  ], []);

  return (
    <div className="flex space-x-2 p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-inner border border-gray-200">
      {views.map((view) => (
        <ViewOption
          key={view.id}
          name={view.name}
          isActive={activeView === view.id}
          onClick={() => setActiveView(view.id)}
        />
      ))}
    </div>
  );
};

// --- TableView Main Component ---

const TableView = ({ filteredRegulations, isFullscreen, handleStartAudit }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [activeView, setActiveView] = useState('compliance'); // New state for view selection

  // Memoize sorted regulations
  const sortedRegulations = useMemo(() => {
    return [...filteredRegulations].sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;

      if (sortConfig.key === 'deadline') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue.toLowerCase() < bValue.toLowerCase()) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue.toLowerCase() > bValue.toLowerCase()) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRegulations, sortConfig]);

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

  // Define column visibility based on activeView
  const columnVisibility = useMemo(() => {
    switch (activeView) {
      case 'compliance':
        // Domaine, Titre, Exigence, Conformité, Actions
        return ['domaine', 'titre', 'exigence', 'conformite', 'actions'];
      case 'action_plan':
        // Titre, Exigence, Priorité, Propriétaire, Échéance, Plan d'actions, Actions
        return ['titre', 'exigence', 'prioritée', 'owner', 'deadline', 'plan_action', 'actions'];
      case 'references':
        // Domaine, Titre, Références légales, Documents légaux, Actions
        return ['domaine', 'titre', 'lois', 'documents', 'actions'];
      case 'full':
      default:
        // Toutes les colonnes
        return ['domaine', 'titre', 'exigence', 'lois', 'documents', 'conformite', 'prioritée', 'plan_action', 'owner', 'deadline', 'actions'];
    }
  }, [activeView]);

  // Map of column keys to their header configuration
  const columnConfig = useMemo(() => ({
    domaine: { label: 'Domaine', sortable: true, width: 'w-40', minWidth: null },
    titre: { label: 'Titre', sortable: true, width: null, minWidth: 'min-w-[200px]' },
    exigence: { label: 'Exigence', sortable: false, width: null, minWidth: 'min-w-[400px]' },
    lois: { label: 'Références légales', sortable: false, width: null, minWidth: 'min-w-[400px]' },
    documents: { label: 'Documents légaux', sortable: false, width: null, minWidth: 'min-w-[400px]' },
    conformite: { label: 'Statut', sortable: true, width: 'w-32', minWidth: null },
    prioritée: { label: 'Priorité', sortable: true, width: 'w-32', minWidth: null },
    plan_action: { label: 'Plan d\'actions', sortable: false, width: null, minWidth: 'min-w-[300px]' },
    owner: { label: 'Propriétaire', sortable: true, width: 'w-40', minWidth: null },
    deadline: { label: 'Échéance', sortable: true, width: 'w-32', minWidth: null },
    actions: { label: 'Actions', sortable: false, width: 'w-32', minWidth: null },
  }), []);

  const commonHeaderProps = "px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider select-none transition-all duration-300 backdrop-blur-sm";
  const sortableHeaderProps = "cursor-pointer hover:text-blue-600 hover:bg-blue-50/50";
  const commonHeaderStyle = "flex items-center space-x-2 group";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-gradient-to-br from-white/95 via-white/90 to-blue-50/80 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-2xl overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(72, 187, 120, 0.05) 0%, transparent 50%)
        `
      }}
    >
      <div className="p-5 flex justify-end">
        <ColumnViewSelector activeView={activeView} setActiveView={setActiveView} />
      </div>

      <div className={`overflow-x-auto flex-grow ${isFullscreen ? 'max-h-[calc(100vh-190px)]' : 'max-h-[calc(100vh-210px)]'} overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400`}>
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-gray-50/90 via-white/90 to-gray-50/90 backdrop-blur-md sticky top-0 z-20 border-b-2 border-gray-100/50">
            <tr>
              {columnVisibility.map((key) => {
                const config = columnConfig[key];
                const headerClassName = `${commonHeaderProps} ${config.width} ${config.minWidth} ${config.sortable ? sortableHeaderProps : ''}`;
                
                return (
                  <th 
                    key={key}
                    className={headerClassName} 
                    onClick={config.sortable ? () => requestSort(key) : undefined}
                  >
                    <div className={commonHeaderStyle}>
                      <span className="group-hover:text-blue-700 transition-colors">{config.label}</span>
                      {config.sortable && (
                        <span className="text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity">
                          {getSortIndicator(key)}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {sortedRegulations.map((regulation, index) => (
              <motion.tr
                key={regulation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className={`
                  transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-white/80 hover:to-indigo-50/50 
                  cursor-pointer group border-l-4 border-transparent hover:border-blue-400 hover:shadow-lg
                  ${index % 2 === 0 
                    ? 'bg-gradient-to-r from-white/60 via-white/40 to-gray-50/30' 
                    : 'bg-gradient-to-r from-gray-50/40 via-white/30 to-white/50'
                  }
                  backdrop-blur-sm hover:backdrop-blur-md
                `}
              >
                {columnVisibility.includes('domaine') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse"></div>
                      <span className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300" title={regulation.domaine || 'Non défini'}>
                        {regulation.domaine || 'Non défini'}
                      </span>
                    </div>
                  </td>
                )}
                {columnVisibility.includes('titre') && (
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <p className="font-semibold line-clamp-2 cursor-help group-hover:text-blue-800 transition-colors duration-300 leading-snug" title={regulation.titre || 'Titre non défini'}>
                      {regulation.titre || 'Titre non défini'}
                    </p>
                  </td>
                )}
                {columnVisibility.includes('exigence') && (
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p className="line-clamp-4 cursor-help leading-relaxed group-hover:text-gray-700 transition-colors duration-300" title={regulation.exigence || 'Aucune exigence définie'}>
                      {regulation.exigence || 'Aucune exigence définie'}
                    </p>
                  </td>
                )}
                {columnVisibility.includes('lois') && (
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p className="line-clamp-4 cursor-help leading-relaxed group-hover:text-gray-700 transition-colors duration-300" title={regulation.lois || 'Aucune référence légale définie'}>
                      {regulation.lois || 'Aucune référence légale définie'}
                    </p>
                  </td>
                )}
                {columnVisibility.includes('documents') && (
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p className="line-clamp-4 cursor-help leading-relaxed group-hover:text-gray-700 transition-colors duration-300" title={regulation.documents || 'Aucune référence légale définie'}>
                      {regulation.documents || 'Aucun document légal est exigé'}
                    </p>
                  </td>
                )}
                {columnVisibility.includes('conformite') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {regulation.conformite ? (
                      <StatusBadge 
                        status={regulation.conformite === 'Conforme' ? 'success' : regulation.conformite === 'Non conforme' ? 'danger' : 'warning'}
                        className="flex items-center space-x-2"
                      >
                        {regulation.conformite === 'Conforme' && <CheckCircleIcon className="h-4 w-4" />}
                        {regulation.conformite === 'Non conforme' && <AlertCircleIcon className="h-4 w-4" />}
                        <span>{regulation.conformite}</span>
                      </StatusBadge>
                    ) : (
                      <StatusBadge status="neutral" className="border-dashed flex items-center space-x-2">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                        <span>En attente</span>
                      </StatusBadge>
                    )}
                  </td>
                )}
                {columnVisibility.includes('prioritée') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {regulation.prioritée ? (
                      <StatusBadge 
                        status={regulation.prioritée === 'Critique' ? 'danger' : regulation.prioritée === 'Élevée' ? 'warning' : 'success'}
                        className="flex items-center space-x-2"
                      >
                        <TrendingUpIcon className="h-4 w-4" />
                        <span>{regulation.prioritée}</span>
                      </StatusBadge>
                    ) : (
                      <span className="text-gray-400 italic text-xs font-medium">Non assigné</span>
                    )}
                  </td>
                )}
                {columnVisibility.includes('plan_action') && (
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {regulation.plan_action ? (
                      <p className="line-clamp-3 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {regulation.plan_action}
                      </p>
                    ) : (
                      <span className="text-gray-400 italic text-xs font-medium">Non défini</span>
                    )}
                  </td>
                )}
                {columnVisibility.includes('owner') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {regulation.owner ? (
                      <StatusBadge 
                        status="neutral"
                        className="flex items-center space-x-2"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>{regulation.owner}</span>
                      </StatusBadge>
                    ) : (
                      <span className="text-gray-400 italic text-xs font-medium">Non assigné</span>
                    )}
                  </td>
                )}
                {columnVisibility.includes('deadline') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {regulation.deadline ? (
                      <StatusBadge 
                        status={new Date(regulation.deadline) < new Date() ? 'danger' : 'info'}
                        className="flex items-center space-x-2"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(regulation.deadline).toLocaleDateString()}</span>
                      </StatusBadge>
                    ) : (
                      <span className="text-gray-400 italic text-xs font-medium">Non définie</span>
                    )}
                  </td>
                )}
                {columnVisibility.includes('actions') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      onClick={() => handleStartAudit(regulation)}
                      variant="outline"
                      size="sm"
                      className="hover:scale-110 group-hover:shadow-xl transform transition-all duration-300"
                    >
                      {regulation.conformite ? 'Modifier' : 'Auditer'}
                    </Button>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Effet de bordure lumineuse au survol */}
      <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl shadow-2xl border border-blue-200/50"></div>
      </div>
    </motion.div>
  );
};

export default TableView;