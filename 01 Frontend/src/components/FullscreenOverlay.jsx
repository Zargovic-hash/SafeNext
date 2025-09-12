import React from 'react';
import { motion } from 'framer-motion';
import { Maximize } from 'lucide-react';

const FullscreenOverlay = ({ isFullscreen }) => {
  if (!isFullscreen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-6 right-6 z-50 bg-black/20 backdrop-blur-sm rounded-lg p-3"
    >
      <div className="flex items-center space-x-2 text-white">
        <Maximize className="h-4 w-4" />
        <span className="text-sm font-medium">Mode plein écran</span>
      </div>
    </motion.div>
  );
};

export default FullscreenOverlay;