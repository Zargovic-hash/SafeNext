import React from 'react';
import { motion } from 'framer-motion';
import { StatusBadge } from "./ui/componentsui";
import RegulationCard from './RegulationCard';

const CardsView = ({ groupedRegulations, isFullscreen, handleStartAudit }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      {Object.entries(groupedRegulations).map(([domaine, items], groupIndex) => (
        <motion.div
          key={domaine}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: groupIndex * 0.1 + 0.2 }}
              className="text-2xl font-bold text-gray-900 flex items-center space-x-3"
            >
              <span>{domaine}</span>
              <StatusBadge status="info" className="text-sm">
                {items.length} {items.length > 1 ? 'éléments' : 'élément'}
              </StatusBadge>
            </motion.h2>
          </div>
          
          <div className={`grid gap-6 ${isFullscreen 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {items.map((regulation, index) => (
              <RegulationCard
                key={regulation.id}
                regulation={regulation}
                index={index}
                groupIndex={groupIndex}
                handleStartAudit={handleStartAudit}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CardsView;