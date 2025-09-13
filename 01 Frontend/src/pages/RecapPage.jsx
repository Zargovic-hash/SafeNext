import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import DocumentIcon from '../icons/DocumentIcon';
import UserIcon from '../icons/UserIcon';
import BarChartIcon from '../icons/BarChartIcon';
import CalendarIcon from '../icons/CalendarIcon';
import { LoadingSpinner } from "../components/ui/componentsui";
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import AuditDetailsTable from '../components/AuditDetailsTable';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const CollapsibleTable = ({ audits, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (audits.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg bg-white rounded-2xl mb-4">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="flex justify-between items-center text-lg">
          {title} ({audits.length})
          {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <CardContent className="p-6 md:p-8">
          <AuditDetailsTable audits={audits} />
        </CardContent>
      </motion.div>
    </Card>
  );
};

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
    owners: {},
    faisabilites: {},
    prioritesFaisabilites: {},
    prioritesDeadlines: {}
  });
  const [allAudits, setAllAudits] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:3001/api';

  const PRIORITY_MAP = {
    '1. Critique 🔴': '#EF4444',
    '2. Élevée 🟠': '#F59E0B',
    '3. Modérée 🟡': '#FCD34D',
    '4. Faible 🟢': '#10B981',
    '5. Amélioration ⚪': '#D1D5DB'
  };

  const FEASIBILITY_MAP = {
    'Facile': '#10B981',
    'Moyen': '#F59E0B',
    'Difficile': '#EF4444'
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

  const getFeasibilityLabel = (feasibility) => {
    const normalizedFeasibility = feasibility?.toLowerCase().trim();
    if (!normalizedFeasibility) return 'Non évaluée';
    if (normalizedFeasibility.includes('facile')) return 'Facile';
    if (normalizedFeasibility.includes('moyen')) return 'Moyen';
    if (normalizedFeasibility.includes('difficile')) return 'Difficile';
    return 'Non évaluée';
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
          const owners = {};
          const faisabilites = {};
          const prioritesFaisabilites = {};
          const prioritesDeadlines = {};

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

            if (regulation.owner) {
              owners[regulation.owner] = (owners[regulation.owner] || 0) + 1;
            }

            const faisabiliteLabel = getFeasibilityLabel(regulation.faisabilite);
            faisabilites[faisabiliteLabel] = (faisabilites[faisabiliteLabel] || 0) + 1;

            if (prioriteLabel !== 'Non définie' && faisabiliteLabel !== 'Non évaluée') {
              if (!prioritesFaisabilites[prioriteLabel]) {
                prioritesFaisabilites[prioriteLabel] = { Facile: 0, Moyen: 0, Difficile: 0 };
              }
              prioritesFaisabilites[prioriteLabel][faisabiliteLabel]++;
            }

            if (prioriteLabel !== 'Non définie') {
              if (!prioritesDeadlines[prioriteLabel]) {
                prioritesDeadlines[prioriteLabel] = { 'Échue': 0, 'À venir': 0 };
              }
              if (regulation.deadline) {
                const deadlineDate = new Date(regulation.deadline);
                deadlineDate.setHours(0, 0, 0, 0);
                if (deadlineDate < today) {
                  prioritesDeadlines[prioriteLabel]['Échue']++;
                  en_retard++;
                } else {
                  prioritesDeadlines[prioriteLabel]['À venir']++;
                }
              } else {
                prioritesDeadlines[prioriteLabel]['À venir']++;
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
            owners,
            faisabilites,
            prioritesFaisabilites,
            prioritesDeadlines
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
      backgroundColor: ['#10B981', '#EF4444', '#6B7280', '#F59E0B'],
      borderWidth: 1,
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
      borderWidth: 1,
    }]
  };
  const domainData = {
    labels: Object.keys(stats.domaines),
    datasets: [{
      label: 'Nombre de réglementations',
      data: Object.values(stats.domaines),
      backgroundColor: '#3B82F6',
      borderColor: '#1E40AF',
      borderWidth: 1,
    }]
  };
  const domainOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  const ownerData = {
    labels: Object.keys(stats.owners),
    datasets: [{
      label: 'Nombre d\'audits',
      data: Object.values(stats.owners),
      backgroundColor: '#9333ea',
    }]
  };
  const faisabiliteLabels = Object.keys(stats.faisabilites).filter(label => label !== 'Non évaluée');
  const faisabiliteCounts = faisabiliteLabels.map(label => stats.faisabilites[label]);
  const faisabiliteColors = faisabiliteLabels.map(label => FEASIBILITY_MAP[label] || '#6B7280');
  const faisabiliteData = {
    labels: faisabiliteLabels,
    datasets: [{
      data: faisabiliteCounts,
      backgroundColor: faisabiliteColors,
      borderWidth: 1,
    }]
  };
  const pfLabels = ['Facile', 'Moyen', 'Difficile'];
  const pfDatasets = Object.keys(PRIORITY_MAP).map(priority => {
    return {
      label: priority,
      data: pfLabels.map(feasibility => {
        return (stats.prioritesFaisabilites[priority] || {})[feasibility] || 0;
      }),
      backgroundColor: PRIORITY_MAP[priority],
    };
  });
  const prioritesFaisabilitesData = {
    labels: pfLabels,
    datasets: pfDatasets
  };
  const pfOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Faisabilité par Priorité' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    }
  };
  const pdLabels = ['Échue', 'À venir'];
  const pdDatasets = Object.keys(PRIORITY_MAP).map(priority => {
    return {
      label: priority,
      data: pdLabels.map(status => {
        return (stats.prioritesDeadlines[priority] || {})[status] || 0;
      }),
      backgroundColor: PRIORITY_MAP[priority],
    };
  });
  const prioritesDeadlinesData = {
    labels: pdLabels,
    datasets: pdDatasets
  };
  const pdOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Statut d\'Échéance par Priorité' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    }
  };

  // Filtrer les données pour chaque tableau
  const conformesAudits = allAudits.filter(a => a.conformite?.toLowerCase().trim() === 'conforme');
  const nonConformesAudits = allAudits.filter(a => a.conformite?.toLowerCase().trim() === 'non conforme' || a.conformite?.toLowerCase().trim() === 'nonconforme');
  const nonApplicablesAudits = allAudits.filter(a => a.conformite?.toLowerCase().trim() === 'non applicable' || a.conformite?.toLowerCase().trim() === 'nonapplicable');
  const enAttenteAudits = allAudits.filter(a => !a.conformite || (a.conformite?.toLowerCase().trim() !== 'conforme' && a.conformite?.toLowerCase().trim() !== 'non conforme' && a.conformite?.toLowerCase().trim() !== 'nonconforme' && a.conformite?.toLowerCase().trim() !== 'non applicable' && a.conformite?.toLowerCase().trim() !== 'nonapplicable'));
  
  const critiqueAudits = allAudits.filter(a => a.prioritée?.toLowerCase().trim().includes('critique'));
  const eleveeAudits = allAudits.filter(a => a.prioritée?.toLowerCase().trim().includes('élevée'));
  const modereeAudits = allAudits.filter(a => a.prioritée?.toLowerCase().trim().includes('modérée'));
  const faibleAudits = allAudits.filter(a => a.prioritée?.toLowerCase().trim().includes('faible'));
  const ameliorationAudits = allAudits.filter(a => a.prioritée?.toLowerCase().trim().includes('amélioration'));
  
  const facileAudits = allAudits.filter(a => a.faisabilite?.toLowerCase().trim().includes('facile'));
  const moyenAudits = allAudits.filter(a => a.faisabilite?.toLowerCase().trim().includes('moyen'));
  const difficileAudits = allAudits.filter(a => a.faisabilite?.toLowerCase().trim().includes('difficile'));

  const getEisenhowerAudits = (priorityLabel, feasibilityLabel) => {
    return allAudits.filter(a =>
      getPriorityLabel(a.prioritée) === priorityLabel &&
      getFeasibilityLabel(a.faisabilite) === feasibilityLabel
    );
  };
  
  const renderAuditTables = (auditsArray, title) => {
    const limitedAudits = auditsArray.slice(0, 10);
    const showLink = auditsArray.length > 10;
    return (
      <>
        <AuditDetailsTable audits={limitedAudits} title={title} />
        {showLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-4 text-sm text-gray-500"
          >
            <Link to="/reglementations" className="text-blue-600 hover:underline">
              Voir plus de détails sur la page réglementations
            </Link>
          </motion.div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Général</h1>
            <Link to="/reglementations">
              <Button>Voir toutes les réglementations</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
              <CardTitle className="text-sm font-medium text-gray-500">Total des Audits</CardTitle>
              <p className="mt-1 text-4xl font-extrabold text-blue-600">{stats.total}</p>
            </Card>
            <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
              <CardTitle className="text-sm font-medium text-gray-500">Conformité</CardTitle>
              <p className="mt-1 text-4xl font-extrabold text-green-600">{stats.conformes}</p>
            </Card>
            <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
              <CardTitle className="text-sm font-medium text-gray-500">Non Conformes</CardTitle>
              <p className="mt-1 text-4xl font-extrabold text-red-600">{stats.non_conformes}</p>
            </Card>
            <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
              <CardTitle className="text-sm font-medium text-gray-500">En Retard</CardTitle>
              <p className="mt-1 text-4xl font-extrabold text-amber-600">{stats.en_retard}</p>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="col-span-1"
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Répartition par Conformité</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6 md:p-8">
                <div className="h-64 w-full md:h-80 flex items-center justify-center">
                  <Pie data={conformityData} />
                </div>
              </CardContent>
            </Card>
            {renderAuditTables(conformesAudits, "Audits Conformes")}
            {renderAuditTables(nonConformesAudits, "Audits Non Conformes")}
            {renderAuditTables(nonApplicablesAudits, "Audits Non Applicables")}
            {renderAuditTables(enAttenteAudits, "Audits en Attente")}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="col-span-1"
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Répartition par Priorité</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6 md:p-8">
                <div className="h-64 w-full md:h-80 flex items-center justify-center">
                  {Object.keys(stats.priorites).length > 0 ? (
                    <Doughnut data={priorityData} />
                  ) : (
                    <div className="text-center text-gray-500 italic">
                      <BarChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donnée de priorité</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {renderAuditTables(critiqueAudits, "Audits Critiques")}
            {renderAuditTables(eleveeAudits, "Audits Élevés")}
            {renderAuditTables(modereeAudits, "Audits Modérés")}
            {renderAuditTables(faibleAudits, "Audits Faibles")}
            {renderAuditTables(ameliorationAudits, "Audits d'Amélioration")}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="col-span-1"
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Répartition par Faisabilité</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6 md:p-8">
                <div className="h-64 w-full md:h-80 flex items-center justify-center">
                  {Object.keys(stats.faisabilites).length > 0 ? (
                    <Doughnut data={faisabiliteData} />
                  ) : (
                    <div className="text-center text-gray-500 italic">
                      <BarChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donnée de faisabilité</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {renderAuditTables(facileAudits, "Audits Faciles")}
            {renderAuditTables(moyenAudits, "Audits Moyens")}
            {renderAuditTables(difficileAudits, "Audits Difficiles")}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Faisabilité par Priorité</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="h-64 md:h-80">
                  {Object.keys(stats.prioritesFaisabilites).length > 0 ? (
                    <Bar data={prioritesFaisabilitesData} options={pfOptions} />
                  ) : (
                    <div className="text-center text-gray-500 italic py-8">
                      <BarChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donnée de faisabilité par priorité</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Statut d'échéance par Priorité</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="h-64 md:h-80">
                  {Object.keys(stats.prioritesDeadlines).length > 0 ? (
                    <Bar data={prioritesDeadlinesData} options={pdOptions} />
                  ) : (
                    <div className="text-center text-gray-500 italic py-8">
                      <BarChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donnée d'échéance par priorité</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Répartition par Domaine</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="h-64 md:h-80">
                  {Object.keys(stats.domaines).length > 0 ? (
                    <Bar data={domainData} options={domainOptions} />
                  ) : (
                    <div className="text-center text-gray-500 italic py-8">
                      <BarChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donnée de domaine</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Répartition par Propriétaire</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="h-64 md:h-80">
                  {Object.keys(stats.owners).length > 0 ? (
                    <Bar data={ownerData} options={domainOptions} />
                  ) : (
                    <div className="text-center text-gray-500 italic py-8">
                      <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donnée de propriétaire</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Diagramme de Priorisation (Eisenhower-like)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-4 gap-2 text-center text-sm font-semibold text-gray-700 mb-2">
                        <div className="col-span-1"></div>
                        <div className="col-span-1">Facile</div>
                        <div className="col-span-1">Moyen</div>
                        <div className="col-span-1">Difficile</div>
                    </div>
                    {Object.keys(PRIORITY_MAP).map(priorityLabel => (
                        <div key={priorityLabel} className="grid grid-cols-4 gap-2 mb-2 items-center">
                            <div className="col-span-1 p-2 rounded-lg text-white font-bold" style={{ backgroundColor: PRIORITY_MAP[priorityLabel] }}>
                                {priorityLabel}
                            </div>
                            {['Facile', 'Moyen', 'Difficile'].map(feasibilityLabel => (
                                <div
                                    key={feasibilityLabel}
                                    className="col-span-1 text-center p-4 rounded-lg bg-gray-100 border border-gray-200 shadow-inner hover:bg-gray-200 transition-colors"
                                >
                                    <span className="font-bold text-lg text-gray-900">{(stats.prioritesFaisabilites[priorityLabel] || {})[feasibilityLabel] || 0}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
        >
          <Card className="shadow-lg bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Détails de la Matrice d'Eisenhower</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {Object.keys(PRIORITY_MAP).map(priorityLabel => (
                <div key={priorityLabel} className="space-y-4">
                  {Object.keys(FEASIBILITY_MAP).map(feasibilityLabel => (
                    <CollapsibleTable
                      key={`${priorityLabel}-${feasibilityLabel}`}
                      audits={getEisenhowerAudits(priorityLabel, feasibilityLabel)}
                      title={`${priorityLabel.split(' ')[1]} & ${feasibilityLabel}`}
                    />
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Échéances à venir</CardTitle>
              </CardHeader>
              <CardContent>
                {deadlines.length === 0 ? (
                  <div className="text-center text-gray-500 italic py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune échéance à venir</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deadlines.map((regulation, index) => (
                      <div
                        key={regulation.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{regulation.titre}</p>
                          <p className="text-sm text-gray-600">{regulation.domaine}</p>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <Badge
                            variant={new Date(regulation.deadline) < new Date() ? 'destructive' : 'secondary'}
                            className="flex items-center space-x-1"
                          >
                            <CalendarIcon className="h-3 w-3" />
                            <span>{new Date(regulation.deadline).toLocaleDateString('fr-FR')}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecapPage;