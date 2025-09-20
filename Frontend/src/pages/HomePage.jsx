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

// Composants améliorés avec de meilleurs styles
const Button = ({ children, size, variant, className, ...props }) => {
  const baseStyle = "font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl";
  const sizeStyle = {
    lg: "px-10 py-5 text-lg",
  }[size] || "px-8 py-4 text-base";
  const variantStyle = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-blue-200",
    secondary: "bg-gradient-to-r from-white to-gray-50 text-blue-600 hover:from-gray-50 hover:to-gray-100 focus:ring-blue-500 border border-blue-200",
    outline: "border-2 border-white text-white hover:bg-white hover:text-blue-600 focus:ring-white backdrop-blur-sm",
  }[variant] || "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-xl rounded-3xl border border-gray-100 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className, ...props }) => (
  <div className={`p-8 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-8 ${className}`} {...props}>
    {children}
  </div>
);

// Icônes améliorées avec de meilleurs styles
const DocumentIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5h-7a2 2 0 01-2-2V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloudIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004-4h10a3 3 0 003 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
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

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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

  // Données pour les graphiques avec couleurs améliorées
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
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        {/* Section héro améliorée */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center relative"
        >
          {/* Éléments décoratifs en arrière-plan */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-20 -right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute -bottom-10 left-1/2 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-10 relative z-10"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 transform hover:rotate-3 transition-transform duration-300">
              <CloudIcon className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-gray-900 relative z-10 text-balance"
          >
            Bienvenue sur{' '}
            <span className="gradient-text">
              SafeNext
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl mx-auto text-sm text-gray-600 font-semibold tracking-wider uppercase relative z-10"
          >
            Développé par le bureau d'étude SafeNex
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed relative z-10 text-pretty"
          >
            SafeNext est la plateforme intelligente qui simplifie et centralise l'audit et la gestion de votre conformité réglementaire. 
            <span className="text-primary-600 font-semibold"> Identifiez rapidement les faisabilités</span>, suivez vos progrès et 
            <span className="text-accent-600 font-semibold"> assurez la conformité</span> de votre organisation.
          </motion.p>
        </motion.div>

        {/* Section des statistiques améliorée */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Vos performances en un coup d'œil
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { icon: DocumentIcon, value: stats.total, label: "Audits Totaux", color: "primary", bgGradient: "from-primary-500 to-primary-600" },
                { icon: CheckCircleIcon, value: stats.conformes, label: "Audits Conformes", color: "success", bgGradient: "from-success-500 to-success-600" },
                { icon: XCircleIcon, value: stats.non_conformes, label: "Audits Non-Conformes", color: "error", bgGradient: "from-error-500 to-error-600" },
                { icon: DocumentIcon, value: stats.non_applicables, label: "Non Applicables", color: "secondary", bgGradient: "from-secondary-500 to-secondary-600" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                >
                  <Card 
                    className="group hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden relative card-interactive"
                    hover={true}
                    interactive={true}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <CardContent className="space-y-6 text-center relative z-10" padding="lg">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center shadow-lg`}>
                        <item.icon className="h-8 w-8 text-white drop-shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <p className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-br ${item.bgGradient} bg-clip-text text-transparent`}>
                          {item.value}
                        </p>
                        <p className="text-sm font-semibold text-gray-600 tracking-wide">
                          {item.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Section graphiques améliorée */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <Card className="h-full" hover={true}>
                  <CardHeader className="text-center" withDivider={true}>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900" gradient={true}>
                      Répartition par Conformité
                    </CardTitle>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto mt-2 rounded-full"></div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center" padding="lg">
                    <div className="h-64 sm:h-80 w-full flex items-center justify-center">
                      <Pie 
                        data={conformityData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
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
                            }
                          },
                          animation: {
                            animateScale: true,
                            animateRotate: true
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <Card className="h-full flex flex-col" hover={true}>
                  <CardHeader className="text-center" withDivider={true}>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900" gradient={true}>
                      Progression de l'audit
                    </CardTitle>
                    <div className="w-16 h-1 bg-gradient-to-r from-success-400 to-primary-400 mx-auto mt-2 rounded-full"></div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-center space-y-8" padding="lg">
                    <div className="text-center">
                      <div className="text-5xl sm:text-6xl font-extrabold gradient-text mb-2">
                        {stats.completionRate}%
                      </div>
                      <p className="text-gray-600 font-semibold">Complété</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Progression</span>
                        <span className="text-sm font-bold text-primary-600">{stats.completionRate}%</span>
                      </div>
                      <div className="relative">
                        <div className="overflow-hidden h-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300">
                          <motion.div
                            style={{ width: `${stats.completionRate}%` }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${stats.completionRate}%` }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-600 rounded-full shadow-lg relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Call to action amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="relative mt-20 sm:mt-32 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700 rounded-3xl"></div>
          <div className="absolute inset-0 bg-black opacity-10 rounded-3xl"></div>
          
          {/* Éléments décoratifs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center text-white">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              Prêt à commencer ?
            </motion.h2>
            <motion.p 
              className="text-primary-100 text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
              Rejoignez les entreprises qui font confiance à notre plateforme pour leur conformité réglementaire.
              <br />
              <span className="text-white font-semibold">Commencez dès aujourd'hui</span> et transformez votre approche de l'audit.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              <Link to="/reglementation">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 font-bold hover:shadow-2xl w-full sm:w-auto"
                >
                  🚀 Commencer maintenant
                </Button>
              </Link>
              <Link to="/recap">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 font-bold hover:shadow-2xl w-full sm:w-auto"
                >
                  📊 Tableau de bord
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;