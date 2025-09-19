import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Enregistrement des composants Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Composants simples directement dans ce fichier
const Button = ({ children, size, variant, className, ...props }) => {
  const baseStyle = "font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300";
  const sizeStyle = {
    lg: "px-8 py-4 text-lg",
  }[size] || "px-6 py-3 text-base";
  const variantStyle = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-blue-600 hover:bg-gray-100 focus:ring-blue-500",
    outline: "border border-white text-white hover:bg-white hover:text-blue-600 focus:ring-white",
  }[variant] || "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-lg rounded-2xl ${className}`} {...props}>
    {children}
  </div>
);
const CardHeader = ({ children, className, ...props }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);
const CardTitle = ({ children, className, ...props }) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);
const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Icônes directement en SVG pour éviter les dépendances
const DocumentIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5h-7a2 2 0 01-2-2V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2z" />
  </svg>
);
const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BarChartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);
const CloudIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 014-4h7.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 011.414 0l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 011.414 0zM12 21h.01M16 21h.01M20 21h.01M16 3h.01" />
  </svg>
);
const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const HomePage = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    conformes: 0,
    non_conformes: 0,
    non_applicables: 0,
    en_attente: 0,
    conformiteRate: 0,
    completionRate: 0,
  });

  const API_BASE = 'https://safetysolution.onrender.com/api';

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/reglementation`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const regulations = await response.json();
          const total = regulations.length;

          let conformes = 0;
          let non_conformes = 0;
          let non_applicables = 0;
          let en_attente = 0;
          
          const normalizeValue = (value) => value?.toString().trim().toLowerCase() || "";
          
          regulations.forEach(r => {
            const normalizedConformite = normalizeValue(r.conformite);
            switch (normalizedConformite) {
              case "conforme":
                conformes++;
                break;
              case "non conforme":
              case "nonconforme":
                non_conformes++;
                break;
              case "non applicable":
              case "nonapplicable":
                non_applicables++;
                break;
              default:
                en_attente++;
                break;
            }
          });

          const totalAudited = conformes + non_conformes + non_applicables;
          const conformiteRate = totalAudited > 0 ? ((conformes + non_applicables) / totalAudited * 100).toFixed(1) : 0;
          const completionRate = total > 0 ? ((totalAudited / total) * 100).toFixed(1) : 0;
          
          setStats({
            total,
            conformes,
            non_conformes,
            non_applicables,
            en_attente,
            conformiteRate,
            completionRate,
          });
        }
      } catch (error) {
        console.error("Erreur de l'API:", error);
      }
    };

    fetchStats();
  }, [token]);

  // Données pour les graphiques
  const conformityData = {
    labels: ['Conformes', 'Non conformes', 'Non applicables', 'En attente'],
    datasets: [{
      data: [stats.conformes, stats.non_conformes, stats.non_applicables, stats.en_attente],
      backgroundColor: ['#10B981', '#EF4444', '#6B7280', '#F59E0B'],
      borderWidth: 1,
    }]
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Nouvelle section de bienvenue */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CloudIcon className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          >
            Bienvenue sur <span className="text-blue-600">ReguAI Audit</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl mx-auto text-sm text-gray-500 font-semibold"
          >
            Développé par le bureau d'étude SafeNex
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-500"
          >
            ReguAI Audit est la plateforme en ligne qui simplifie et centralise l'audit et la gestion de votre conformité réglementaire. Identifiez rapidement les risques, suivez vos progrès et assurez la conformité de votre organisation.
          </motion.p>
        </motion.div>

        {/* Section des statistiques */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Vos performances en un coup d'œil
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
                <CardContent className="space-y-2">
                  <DocumentIcon className="h-10 w-10 text-blue-600 mx-auto" />
                  <p className="text-4xl font-extrabold text-blue-600">{stats.total}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">Audits Totaux</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
                <CardContent className="space-y-2">
                  <CheckCircleIcon className="h-10 w-10 text-green-600 mx-auto" />
                  <p className="mt-1 text-4xl font-extrabold text-green-600">{stats.conformes}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">Audits Conformes</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
                <CardContent className="space-y-2">
                  <XCircleIcon className="h-10 w-10 text-red-600 mx-auto" />
                  <p className="mt-1 text-4xl font-extrabold text-red-600">{stats.non_conformes}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">Audits Non-Conformes</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
                <CardContent className="space-y-2">
                  <DocumentIcon className="h-10 w-10 text-gray-500 mx-auto" />
                  <p className="mt-1 text-4xl font-extrabold text-gray-500">{stats.non_applicables}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">Non Applicables</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Card className="shadow-lg p-6 bg-white rounded-xl">
                  <CardHeader>
                    <CardTitle>Répartition par Conformité</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-6 md:p-8">
                    <div className="h-64 w-full flex items-center justify-center">
                      <Pie data={conformityData} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <Card className="shadow-lg p-6 bg-white rounded-xl h-full flex flex-col justify-center">
                  <CardHeader>
                    <CardTitle>Progression de l'audit</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Complétion
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {stats.completionRate}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <motion.div
                          style={{ width: `${stats.completionRate}%` }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${stats.completionRate}%` }}
                          transition={{ duration: 1.5 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                        ></motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-blue-600 rounded-2xl p-12 text-center text-white mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises qui font confiance à notre plateforme pour leur conformité réglementaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reglementation">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
                Commencer maintenant
              </Button>
            </Link>
            <Link to="/recap">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600 transition-all">
                Tableau de bord
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;