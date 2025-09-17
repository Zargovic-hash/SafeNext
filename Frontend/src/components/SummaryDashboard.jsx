import React, { useMemo } from "react";
import { motion } from "framer-motion";

const StatCard = ({ value, label, color }) => (
  <div className="flex flex-col items-center justify-center p-1 bg-white rounded-md shadow-sm transform transition-transform duration-300 hover:scale-105 cursor-pointer">
    <div className={`text-xl font-extrabold ${color}`}>{value}</div>
    <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-wide text-center leading-tight">{label}</div>
  </div>
);

const SummaryDashboard = ({ regulations, className = "" }) => {
  const stats = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const initialStats = {
      total: 0,
      conforme: 0,
      nonConforme: 0,
      nonApplicable: 0,
      enAttente: 0,
      deadlinesProches: 0,
      overdue: 0,
    };

    const countStats = regulations.reduce((acc, r) => {
      acc.total++;

      const normalizedConformite = r.conformite?.toString().trim().toLowerCase() || "";
      switch (normalizedConformite) {
        case "conforme":
          acc.conforme++;
          break;
        case "non conforme":
        case "nonconforme":
          acc.nonConforme++;
          break;
        case "non applicable":
        case "nonapplicable":
          acc.nonApplicable++;
          break;
        default:
          acc.enAttente++;
          break;
      }

      if (r.deadline) {
        const deadline = new Date(r.deadline);
        if (deadline < today) {
          acc.overdue++;
        } else if (deadline > today && deadline <= thirtyDaysFromNow) {
          acc.deadlinesProches++;
        }
      }

      return acc;
    }, initialStats);
    
    const elementsAudites = countStats.conforme + countStats.nonConforme + countStats.nonApplicable;
    const conformiteRate = elementsAudites > 0 ? Math.round(((countStats.conforme + countStats.nonApplicable) / elementsAudites) * 100) : 0;

    return {
      ...countStats,
      conformiteRate,
    };
  }, [regulations]);

  const cards = [
    { value: stats.total, label: "Total", color: "text-gray-900" },
    { value: stats.conforme, label: "Conforme", color: "text-emerald-500" },
    { value: stats.nonConforme, label: "Non conforme", color: "text-red-500" },
    { value: stats.nonApplicable, label: "Non applicable", color: "text-gray-500" },
    { value: stats.enAttente, label: "En attente", color: "text-amber-500" },
    { value: stats.deadlinesProches, label: "Échéances proches", color: "text-purple-500" },
    { value: stats.overdue, label: "En retard", color: "text-rose-500" },
    { value: `${stats.conformiteRate}%`, label: "Taux conformité", color: "text-indigo-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-md shadow-xl p-2 border border-gray-200 ${className}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-1">
        {cards.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard {...item} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SummaryDashboard;
