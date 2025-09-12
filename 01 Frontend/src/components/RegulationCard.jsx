import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button, StatusBadge } from "./ui/componentsui";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  UserIcon,
  CalendarIcon,
  DocumentIcon
} from "../icons/icon";

const RegulationCard = ({ regulation, index, groupIndex, handleStartAudit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ 
        delay: (groupIndex * 0.1) + (index * 0.05),
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between space-x-3">
            <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-blue-700 transition-colors duration-200 flex-1">
              {regulation.titre || 'Titre non défini'}
            </CardTitle>
            {regulation.conformite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (groupIndex * 0.1) + (index * 0.05) + 0.3 }}
              >
                <StatusBadge 
                  status={regulation.conformite === 'Conforme' ? 'success' : regulation.conformite === 'Non conforme' ? 'danger' : 'warning'}
                  className="flex-shrink-0 shadow-sm"
                >
                  {regulation.conformite === 'Conforme' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                  {regulation.conformite === 'Non conforme' && <AlertCircleIcon className="h-3 w-3 mr-1" />}
                  {regulation.conformite}
                </StatusBadge>
              </motion.div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 relative z-10">
          <div className="space-y-4">
            {regulation.exigence && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 text-sm flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Exigence</span>
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed bg-gray-50/50 rounded-lg p-3">
                  {regulation.exigence}
                </p>
              </div>
            )}
            
            {regulation.lois && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 text-sm flex items-center space-x-1">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Références légales</span>
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed bg-amber-50/50 rounded-lg p-3">
                  {regulation.lois}
                </p>
              </div>
            )}

            {/* Informations d'audit */}
            {(regulation.prioritée || regulation.owner || regulation.deadline) && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {regulation.prioritée && (
                    <StatusBadge 
                      status={regulation.prioritée === 'Critique' ? 'danger' : regulation.prioritée === 'Élevée' ? 'warning' : 'success'}
                      className="text-xs"
                    >
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      {regulation.prioritée}
                    </StatusBadge>
                  )}
                  {regulation.owner && (
                    <StatusBadge status="neutral" className="text-xs">
                      <UserIcon className="h-3 w-3 mr-1" />
                      {regulation.owner}
                    </StatusBadge>
                  )}
                  {regulation.deadline && (
                    <StatusBadge status="info" className="text-xs">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {new Date(regulation.deadline).toLocaleDateString()}
                    </StatusBadge>
                  )}
                </div>
              </div>
            )}

            {regulation.documents && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (groupIndex * 0.1) + (index * 0.05) + 0.4 }}
              >
                <StatusBadge status="neutral" className="w-fit mt-3 flex items-center space-x-1">
                  <DocumentIcon className="h-3 w-3" />
                  <span>{regulation.documents}</span>
                </StatusBadge>
              </motion.div>
            )}

            <div className="pt-3 border-t border-gray-100">
              <Button
                onClick={() => handleStartAudit(regulation)}
                variant="outline"
                className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                size="sm"
              >
                <span className="flex items-center justify-center space-x-2">
                  {regulation.conformite ? (
                    <>
                      <span>Modifier l'audit</span>
                      <motion.svg 
                        className="h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </motion.svg>
                    </>
                  ) : (
                    <>
                      <span>Démarrer l'audit</span>
                      <motion.svg 
                        className="h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegulationCard;