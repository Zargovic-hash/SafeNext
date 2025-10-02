import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import DocumentIcon from '../icons/DocumentIcon';
import UserIcon from '../icons/UserIcon';
import CalendarIcon from '../icons/CalendarIcon';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Pie, Doughnut, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import AuditDetailsTable from '../components/AuditDetailsTable';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import ReportButton from '../components/ReportButton';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XCircleIcon from '../icons/XCircleIcon';
import ClockIcon from '../icons/ClockIcon';

// Import des composants depuis RecapPageComponents
import {
  KanbanBoard,
  AuditTimeline,
  BurndownChart,
  OwnerRadarChart,
} from '../components/RecapPageComponents';

// Enregistrement des éléments Chart.js nécessaires
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale
);

// ==================== COMPOSANTS EXISTANTS ====================

const ModernKPICard = ({ title, value, subtitle, icon, bgGradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <Card className="text-center transition-all duration-300 transform hover:scale-105 group cursor-pointer overflow-hidden relative bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-xl hover:shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left flex-1">
              <CardTitle className="text-sm font-medium text-slate-600 mb-2">{title}</CardTitle>
              <p className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-br ${bgGradient} bg-clip-text text-transparent`}>
                {value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white shadow-lg`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EisenhowerMatrix = ({ allAudits }) => {
  const [selectedAction, setSelectedAction] = useState(null);

  const quadrants = useMemo(() => {
    const getImportance = (priorite) => {
      const normalizedPriority = priorite?.toLowerCase().trim();
      return normalizedPriority?.includes('critique') || normalizedPriority?.includes('élevée');
    };

    const getUrgency = (deadline, priorite) => {
      if (!deadline && priorite?.toLowerCase().includes('critique')) return true;
      if (!deadline) return false;

      const today = new Date();
      const deadlineDate = new Date(deadline);
      const daysDiff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

      if (priorite?.toLowerCase().includes('critique')) return daysDiff <= 30;
      if (priorite?.toLowerCase().includes('élevée')) return daysDiff <= 21;
      return daysDiff <= 14;
    };

    const isEvaluated = (conformite) => {
      const normalizedConformite = conformite?.toLowerCase().trim();
      return normalizedConformite === 'conforme' ||
             normalizedConformite === 'non conforme' ||
             normalizedConformite === 'nonconforme' ||
             normalizedConformite === 'non applicable' ||
             normalizedConformite === 'nonapplicable';
    };

    const q1 = allAudits.filter(a => getImportance(a.prioritée) && getUrgency(a.deadline, a.prioritée));
    const q2 = allAudits.filter(a => getImportance(a.prioritée) && !getUrgency(a.deadline, a.prioritée));
    const q3 = allAudits.filter(a => !getImportance(a.prioritée) && getUrgency(a.deadline, a.prioritée));
    const q4 = allAudits.filter(a => !getImportance(a.prioritée) && !getUrgency(a.deadline, a.prioritée) && isEvaluated(a.conformite) && a.deadline);

    return [
      {
        id: 'q1',
        title: 'Important & Urgent',
        subtitle: 'À faire immédiatement',
        actions: q1,
        color: 'border-red-300 bg-gradient-to-br from-red-50 to-red-100',
        headerColor: 'text-red-700 bg-gradient-to-r from-red-100 to-red-200',
        bgGradient: 'from-red-500 to-red-600'
      },
      {
        id: 'q2',
        title: 'Important & Non Urgent',
        subtitle: 'À planifier',
        actions: q2,
        color: 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100',
        headerColor: 'text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200',
        bgGradient: 'from-blue-500 to-blue-600'
      },
      {
        id: 'q3',
        title: 'Non Important & Urgent',
        subtitle: 'À déléguer',
        actions: q3,
        color: 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100',
        headerColor: 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200',
        bgGradient: 'from-yellow-500 to-yellow-600'
      },
      {
        id: 'q4',
        title: 'Faible Priorité',
        subtitle: 'Actions de maintenance',
        actions: q4,
        color: 'border-green-300 bg-gradient-to-br from-green-50 to-green-100',
        headerColor: 'text-green-700 bg-gradient-to-r from-green-100 to-green-200',
        bgGradient: 'from-green-500 to-green-600'
      },
    ];
  }, [allAudits]);

  const ActionTag = ({ action }) => {
    const getPriorityColor = (priorite) => {
      const normalizedPriority = priorite?.toLowerCase().trim();
      if (normalizedPriority?.includes('critique')) return 'bg-red-100 text-red-800 border-red-200';
      if (normalizedPriority?.includes('élevée')) return 'bg-orange-100 text-orange-800 border-orange-200';
      if (normalizedPriority?.includes('modérée')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      if (normalizedPriority?.includes('faible')) return 'bg-green-100 text-green-800 border-green-200';
      return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    const getStatusColor = (conformite) => {
      const normalizedConformite = conformite?.toLowerCase().trim();
      if (normalizedConformite === 'conforme') return 'bg-green-500';
      if (normalizedConformite === 'non conforme' || normalizedConformite === 'nonconforme') return 'bg-red-500';
      return 'bg-slate-400';
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.02, y: -2 }}
        onClick={() => setSelectedAction(action)}
        className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${getPriorityColor(action.prioritée)}`}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">{action.titre}</h4>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(action.conformite)}`}></div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-600">{action.domaine}</p>
          {action.owner && <p className="text-xs text-slate-500 flex items-center gap-1">
            <UserIcon className="w-3 h-3" /> {action.owner}
          </p>}
          {action.deadline && <p className="text-xs text-slate-500 flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" /> {new Date(action.deadline).toLocaleDateString('fr-FR')}
          </p>}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">Matrice d'Eisenhower</h2>
        <CardDescription className="text-lg max-w-3xl mx-auto">
          Priorisez vos audits selon leur importance et urgence pour une gestion optimale
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quadrants.map((quadrant, index) => (
          <motion.div
            key={quadrant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`border-2 rounded-2xl p-6 ${quadrant.color} min-h-[400px] shadow-xl hover:shadow-2xl transition-all duration-300`}
          >
            <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl ${quadrant.headerColor} backdrop-blur-sm`}>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{quadrant.title}</h3>
                <p className="text-sm opacity-75">{quadrant.subtitle}</p>
              </div>
              <Badge variant="outline" className={`bg-gradient-to-r ${quadrant.bgGradient} text-white border-none shadow-lg`}>
                {quadrant.actions.length}
              </Badge>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <AnimatePresence>
                {quadrant.actions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-slate-500"
                  >
                    <p className="font-medium">Aucune action dans ce quadrant</p>
                    <p className="text-sm mt-2">C'est parfait pour votre productivité!</p>
                  </motion.div>
                ) : (
                  quadrant.actions.slice(0, 10).map(action => (
                    <ActionTag key={action.id} action={action} />
                  ))
                )}
              </AnimatePresence>
              {quadrant.actions.length > 10 && (
                <motion.div className="text-center pt-4">
                  <Link
                    to="/reglementation"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                  >
                    + {quadrant.actions.length - 10} autres actions
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAction(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedAction.titre}</h3>
                  <Badge variant="outline" className="text-xs">{selectedAction.domaine}</Badge>
                </div>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {selectedAction.exigence && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Exigence réglementaire</p>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedAction.exigence}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Priorité</p>
                    <Badge variant="outline" className={
                      selectedAction.prioritée?.toLowerCase().includes('critique') ? 'bg-red-100 text-red-800 border-red-300' :
                      selectedAction.prioritée?.toLowerCase().includes('élevée') ? 'bg-orange-100 text-orange-800 border-orange-300' :
                      'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }>
                      {selectedAction.prioritée}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Statut</p>
                    <Badge variant="outline" className={
                      selectedAction.conformite?.toLowerCase() === 'conforme' ? 'bg-green-100 text-green-800 border-green-300' :
                      'bg-red-100 text-red-800 border-red-300'
                    }>
                      {selectedAction.conformite || 'En attente'}
                    </Badge>
                  </div>
                </div>

                {selectedAction.plan_action && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Plan d'action</p>
                    <p className="text-slate-600 bg-blue-50 p-3 rounded-lg">{selectedAction.plan_action}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-slate-600 pt-4 border-t">
                  {selectedAction.owner && (
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> {selectedAction.owner}
                    </span>
                  )}
                  {selectedAction.deadline && (
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> {new Date(selectedAction.deadline).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CollapsibleTable = ({ audits, title, icon, color = "primary" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (audits.length === 0) {
    return null;
  }

  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    success: "from-success-500 to-success-600",
    error: "from-error-500 to-error-600",
    warning: "from-warning-500 to-warning-600",
    secondary: "from-secondary-500 to-secondary-600"
  };

  return (
    <Card className="mb-4 overflow-hidden bg-white/80 backdrop-blur-xl shadow-xl border-slate-200/60" hover={true}>
      <CardHeader
        className="cursor-pointer hover:bg-gradient-to-r hover:from-slate-50 hover:to-primary-50 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        withDivider={false}
      >
        <CardTitle className="flex justify-between items-center text-lg group">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} shadow-sm`}></div>
            {icon && <span className="text-slate-600">{icon}</span>}
            <span className="font-bold text-slate-900">{title}</span>
            <Badge variant="outline" className={`ml-2 bg-gradient-to-r from-primary-100 to-primary-200 border-primary-300 shadow-sm`}>
              {audits.length}
            </Badge>
          </div>
          <div className="transform group-hover:scale-110 transition-transform duration-200">
            {isOpen ?
              <ChevronUpIcon className="h-5 w-5 text-primary-600" /> :
              <ChevronDownIcon className="h-5 w-5 text-slate-400" />
            }
          </div>
        </CardTitle>
      </CardHeader>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <CardContent className="bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm" padding="lg">
          <AuditDetailsTable audits={audits} />
        </CardContent>
      </motion.div>
    </Card>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================

const RecapPage = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    conformes: 0,
    non_conformes: 0,
    non_applicables: 0,
    en_attente: 0,
    en_retard: 0,
    domaines: {},
    priorites: {},
    owners: {} // Ajouté pour OwnerRadarChart
  });
  const [allAudits, setAllAudits] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const PRIORITY_MAP = {
    '1. Critique 🔴': '#EF4444',
    '2. Élevée 🟠': '#F59E0B',
    '3. Modérée 🟡': '#FCD34D',
    '4. Faible 🟢': '#10B981',
    '5. Amélioration ⚪': '#D1D5DB'
  };

  const getPriorityLabel = (priority) => {
    const normalizedPriority = priority?.toLowerCase().trim();
    if (!normalizedPriority) return 'Non définie';
    if (normalizedPriority.includes('critique')) return '1. Critique 🔴';
    if (normalizedPriority.includes('élevée')) return '2. Élevée 🟠';
    if (normalizedPriority.includes('modérée')) return '3. Modérée 🟡';
    if (normalizedPriority.includes('faible')) return '4. Faible 🟢';
    if (normalizedPriority.includes('amélioration')) return '5. Amélioration ⚪';
    return 'Non définie';
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/reglementation`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const regulations = await response.json();
          setAllAudits(regulations || []);

          let conformes = 0;
          let non_conformes = 0;
          let non_applicables = 0;
          let en_attente = 0;
          let en_retard = 0;
          const priorites = {};
          const domaines = {};
          const owners = {}; // Ajouté pour OwnerRadarChart

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          (regulations || []).forEach(regulation => {
            const conformite = regulation.conformite?.toLowerCase().trim();

            if (conformite === 'conforme') {
              conformes++;
            } else if (conformite === 'non conforme' || conformite === 'nonconforme') {
              non_conformes++;
            } else if (conformite === 'non applicable' || conformite === 'nonapplicable') {
              non_applicables++;
            } else {
              en_attente++;
            }

            const prioriteLabel = getPriorityLabel(regulation.prioritée);
            priorites[prioriteLabel] = (priorites[prioriteLabel] || 0) + 1;

            if (regulation.domaine) {
              domaines[regulation.domaine] = (domaines[regulation.domaine] || 0) + 1;
            }

            // Ajout pour OwnerRadarChart
            if (regulation.owner) {
              owners[regulation.owner] = (owners[regulation.owner] || 0) + 1;
            }

            if (regulation.deadline) {
              const deadlineDate = new Date(regulation.deadline);
              deadlineDate.setHours(0, 0, 0, 0);
              if (deadlineDate < today) {
                en_retard++;
              }
            }
          });

          const deadlinesProches = (regulations || [])
            .filter(regulation => {
              if (!regulation.deadline) return false;
              const deadlineDate = new Date(regulation.deadline);
              const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
              return deadlineDate > today && deadlineDate <= thirtyDaysFromNow;
            })
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5);

          setStats({
            total: (regulations || []).length,
            conformes,
            non_conformes,
            non_applicables,
            en_attente,
            en_retard,
            priorites,
            domaines,
            owners // Ajouté pour OwnerRadarChart
          });

          setDeadlines(deadlinesProches);

        } else {
          console.error("Erreur de récupération des audits");
        }
      } catch (error) {
        console.error("Erreur de l'API :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const conformityData = {
    labels: ['Conformes', 'Non conformes', 'Non applicables', 'En attente'],
    datasets: [{
      data: [stats.conformes, stats.non_conformes, stats.non_applicables, stats.en_attente],
      backgroundColor: [
        'rgba(16, 185, 129, 0.9)',
        'rgba(239, 68, 68, 0.9)',
        'rgba(107, 114, 128, 0.9)',
        'rgba(245, 158, 11, 0.9)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(107, 114, 128, 1)',
        'rgba(245, 158, 11, 1)'
      ],
      borderWidth: 2,
    }]
  };

  const priorityLabels = Object.keys(stats.priorites).filter(label => label !== 'Non définie');
  const priorityCounts = priorityLabels.map(label => stats.priorites[label]);
  const priorityColors = priorityLabels.map(label => PRIORITY_MAP[label] || '#D1D5DB');

  const priorityData = {
    labels: priorityLabels,
    datasets: [{
      data: priorityCounts,
      backgroundColor: priorityColors,
      borderColor: priorityColors.map(color => color + 'DD'),
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 12,
        padding: 12
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LoadingSpinner size="xl" text="Chargement du tableau de bord..." variant="primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text mb-4">
            Tableau de Bord Récapitulatif
          </h1>
          <CardDescription className="text-lg max-w-3xl mx-auto mb-6">
            Visualisez et priorisez vos audits réglementaires pour une gestion optimale de vos tâches.
          </CardDescription>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ReportButton
              type="dashboard"
              size="md"
              className="transform hover:scale-105 transition-all duration-200"
            >
              Générer Rapport
            </ReportButton>
            <Link to="/reglementation">
              <Button
                variant="primary"
                size="md"
                className="transform hover:scale-105 transition-all duration-200"
              >
                Voir Réglementations
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            {
              title: "Total Audits",
              value: stats.total,
              subtitle: "Réglementations",
              icon: <DocumentIcon className="h-6 w-6" />,
              bgGradient: "from-primary-500 to-primary-600",
            },
            {
              title: "Conformes",
              value: stats.conformes,
              subtitle: `${stats.total > 0 ? Math.round((stats.conformes / stats.total) * 100) : 0}% du total`,
              icon: <CheckCircleIcon className="h-6 w-6" />,
              bgGradient: "from-success-500 to-success-600",
            },
            {
              title: "Non Conformes",
              value: stats.non_conformes,
              subtitle: "Nécessitent action",
              icon: <XCircleIcon className="h-6 w-6" />,
              bgGradient: "from-error-500 to-error-600",
            },
            {
              title: "En Retard",
              value: stats.en_retard,
              subtitle: "Échéances dépassées",
              icon: <ClockIcon className="h-6 w-6" />,
              bgGradient: "from-warning-500 to-warning-600",
            }
          ].map((item, index) => (
            <ModernKPICard
              key={item.title}
              {...item}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Timeline des Audits - Importé de RecapPageComponents */}
        <AuditTimeline allAudits={allAudits} />

        {/* Matrice d'Eisenhower */}
        <EisenhowerMatrix allAudits={allAudits} />





        {/* Burndown Chart & Owner Radar - Nouveaux composants ajoutés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <BurndownChart allAudits={allAudits} />
          <OwnerRadarChart stats={stats} />
        </motion.div>

        {/* Analyses Détaillées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="space-y-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
              Analyses Détaillées
            </h3>
            <CardDescription>
              Explorez vos données d'audit avec des visualisations interactives
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-xl shadow-xl border-slate-200/60" hover={true}>
                <CardHeader className="text-center" withDivider={true}>
                  <CardTitle className="text-xl font-bold gradient-text">
                    Répartition par Conformité
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center" padding="lg">
                  <div className="h-64 w-full flex items-center justify-center">
                    <Pie data={conformityData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-xl shadow-xl border-slate-200/60" hover={true}>
                <CardHeader className="text-center" withDivider={true}>
                  <CardTitle className="text-xl font-bold gradient-text">
                    Répartition par Priorité
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center" padding="lg">
                  <div className="h-64 w-full flex items-center justify-center">
                    <Doughnut data={priorityData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Tables Collapsibles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="space-y-4"
        >
          <CollapsibleTable
            audits={deadlines}
            title="Audits avec Échéances Prochaines"
            icon={<CalendarIcon className="h-5 w-5 text-primary-600" />}
            color="primary"
          />
          <CollapsibleTable
            audits={allAudits.filter(a => a.conformite?.toLowerCase().trim() === 'non conforme' || a.conformite?.toLowerCase().trim() === 'nonconforme')}
            title="Audits Non Conformes"
            icon={<XCircleIcon className="h-5 w-5 text-error-600" />}
            color="error"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default RecapPage;