// ./components/SummaryDashboard.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

const StatCard = ({ value, label, color }) => (
  <div className="text-center">
    <div className={`text-lg font-semibold ${color}`}>{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);

const SummaryDashboard = ({ regulations, className = "" }) => {
  const stats = useMemo(() => {
    const total = regulations.length;
    const conforme = regulations.filter(r => r.conformite === "Conforme").length;
    const nonConforme = regulations.filter(r => r.conformite === "Non conforme").length;
    const enAttente = regulations.filter(r => !r.conformite || r.conformite === "").length;

    const elementsAudites = conforme + nonConforme;
    const conformiteRate = elementsAudites > 0 ? Math.round((conforme / elementsAudites) * 100) : 0;

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const deadlinesProches = regulations.filter(r => {
      if (!r.deadline) return false;
      const deadline = new Date(r.deadline);
      return deadline >= today && deadline <= thirtyDaysFromNow;
    }).length;

    return { total, conforme, nonConforme, enAttente, deadlinesProches, conformiteRate };
  }, [regulations]);

  const cards = [
    { value: stats.total, label: "Total", color: "text-blue-600" },
    { value: stats.conforme, label: "Conforme", color: "text-emerald-600" },
    { value: stats.nonConforme, label: "Non conforme", color: "text-red-600" },
    { value: stats.enAttente, label: "En attente", color: "text-amber-600" },
    { value: stats.deadlinesProches, label: "Échéances proches", color: "text-purple-600" },
    { value: `${stats.conformiteRate}%`, label: "Taux conformité", color: "text-indigo-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-2 border border-blue-100/60 ${className}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {cards.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>
    </motion.div>
  );
};

export default SummaryDashboard;
