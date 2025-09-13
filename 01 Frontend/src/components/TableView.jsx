import React from 'react';
import { motion } from 'framer-motion';
import { Button, StatusBadge } from "./ui/componentsui";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  UserIcon,
  CalendarIcon
} from "../icons/icon";

const TableView = ({ filteredRegulations, isFullscreen, handleStartAudit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl overflow-hidden"
    >
      <div className={`overflow-x-auto ${isFullscreen ? 'max-h-[calc(100vh-120px)]' : 'max-h-[calc(100vh-140px)]'} overflow-y-auto`}>
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">Domaine</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[200px]">Titre</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[400px]">Exigence</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[400px]">Références légales</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[400px]">documents légales</th>              
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Statut</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Priorité</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[300px]">Plan d'actions</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">Propriétaire</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Échéance</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-50">
            {filteredRegulations.map((regulation, index) => (
              <motion.tr
                key={regulation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
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
                    {regulation.documents || 'Aucun docuement légale est exigé'}
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
