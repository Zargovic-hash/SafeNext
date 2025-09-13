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
    
    // Fonction helper pour normaliser les valeurs
    const normalizeValue = (value) => {
      if (!value) return "";
      return value.toString().trim().toLowerCase();
    };
    
    // Compter avec normalisation des valeurs
    const conforme = regulations.filter(r => {
      const normalized = normalizeValue(r.conformite);
      return normalized === "conforme";
    }).length;
    
    const nonConforme = regulations.filter(r => {
      const normalized = normalizeValue(r.conformite);
      return normalized === "non conforme" || normalized === "nonconforme";
    }).length;
    
    const nonApplicable = regulations.filter(r => {
      const normalized = normalizeValue(r.conformite);
      return normalized === "non applicable" || normalized === "nonapplicable";
    }).length;
    
    const enAttente = regulations.filter(r => {
      const normalized = normalizeValue(r.conformite);
      return normalized === "" || 
             normalized === "en attente" || 
             normalized === "enattente" ||
             !r.conformite;
    }).length;
    
    // Les éléments audités sont ceux qui ont un statut défini (excluant "en attente" et vides)
    const elementsAudites = conforme + nonConforme + nonApplicable;
    
    // Le taux de conformité se calcule sur les éléments applicables seulement
    const elementsApplicables = conforme + nonConforme;
    const conformiteRate = elementsApplicables > 0 ? Math.round(( (conforme+ nonApplicable)  / elementsAudites) * 100) : 0;
    
    // Calcul des échéances proches (30 jours)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const deadlinesProches = regulations.filter(r => {
      if (!r.deadline) return false;
      const deadline = new Date(r.deadline);
      return deadline >= today && deadline <= thirtyDaysFromNow;
    }).length;
    
    return { 
      total, 
      conforme, 
      nonConforme, 
      nonApplicable,
      enAttente, 
      deadlinesProches, 
      overdue: regulations.filter(r => r.deadline && new Date(r.deadline) < today).length,
      conformiteRate 
    };
  }, [regulations]);

  const cards = [
    { value: stats.total, label: "Total", color: "text-blue-600" },
    { value: stats.conforme, label: "Conforme", color: "text-emerald-600" },
    { value: stats.nonConforme, label: "Non conforme", color: "text-red-600" },
    { value: stats.nonApplicable, label: "Non applicable", color: "text-gray-600" },
    { value: stats.enAttente, label: "En attente", color: "text-amber-600" },
    { value: stats.deadlinesProches, label: "Échéances proches", color: "text-purple-600" },
    { value: stats.overdue, label: "En retard", color: "text-purple-600" },
    { value: `${stats.conformiteRate}%`, label: "Taux conformité", color: "text-indigo-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-2 border border-blue-100/60 ${className}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {cards.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>
    </motion.div>
  );
};

export default SummaryDashboard;