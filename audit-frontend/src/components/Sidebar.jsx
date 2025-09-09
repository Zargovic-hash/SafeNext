import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FilterIcon from '../icons/FilterIcon';
import Label from './ui/Label';
import Badge from './ui/Badge';

const Sidebar = ({ domaines, selectedDomaine, onDomaineChange, className = "" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`bg-white border-r border-gray-200 h-full ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FilterIcon className="h-5 w-5 mr-2" />
              Filtres
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Étendre' : 'Réduire'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {!isCollapsed && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Domaines ({domaines.length})
              </Label>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                <button
                  onClick={() => onDomaineChange('')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedDomaine === ''
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Tous les domaines</span>
                    <Badge variant="outline" className="text-xs">
                      {domaines.length}
                    </Badge>
                  </div>
                </button>
                {domaines.map((domaine) => (
                  <button
                    key={domaine}
                    onClick={() => onDomaineChange(domaine)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedDomaine === domaine
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={domaine}
                  >
                    <span className="truncate block">{domaine}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;