import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

const Badge = ({ children, variant, className, ...props }) => {
  const variantStyle = {
    default: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
  }[variant] || "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyle} ${className}`} {...props}>
      {children}
    </span>
  );
};

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
const TrendingUpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h-1a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1zm-4 4h-1a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1zm-4 4h-1a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1z" />
  </svg>
);
const QuoteIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 7.5V16.5m-4.5-9h9m-4.5 9h9m-4.5 0h4.5m4.5 0v-9h-9" />
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
const ShieldIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const testimonials = [
  {
    quote: "Grâce à cette plateforme, notre processus d'audit est devenu 50% plus rapide. Un outil indispensable !",
    author: "Jean-Pierre Dubois",
    title: "Directeur de la Conformité, Innovatech"
  },
  {
    quote: "L'interface est intuitive et les statistiques en temps réel nous aident à prendre des décisions stratégiques instantanément.",
    author: "Marie Lemaire",
    title: "Responsable Qualité, SecureCorp"
  },
  {
    quote: "Une solution complète et sécurisée. La centralisation des données a transformé notre gestion réglementaire.",
    author: "Ahmed Benali",
    title: "CISO, Global Solutions"
  }
];

const HomePage = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    conformes: 0,
    non_conformes: 0,
    conformiteRate: 0,
    completionRate: 0,
  });
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/reglementation`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const regulations = await response.json();
          const total = regulations.length;

          const normalizeValue = (value) => value?.toString().trim().toLowerCase() || "";
          
          const conformes = regulations.filter(r => normalizeValue(r.conformite) === "conforme").length;
          const non_conformes = regulations.filter(r => normalizeValue(r.conformite) === "non conforme" || normalizeValue(r.conformite) === "nonconforme").length;
          
          const totalAudited = conformes + non_conformes;
          const conformiteRate = totalAudited > 0 ? ((conformes / totalAudited) * 100).toFixed(1) : 0;
          const completionRate = total > 0 ? ((totalAudited / total) * 100).toFixed(1) : 0;

          const recent = regulations
            .filter(r => r.updated_at)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 5);

          setStats({
            total,
            conformes,
            non_conformes,
            conformiteRate,
            completionRate
          });
          setRecentAudits(recent);
        }
      } catch (error) {
        console.error("Erreur de l'API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const dataConformite = [
    { name: 'Conformes', value: stats.conformes, color: '#22C55E' },
    { name: 'Non-Conformes', value: stats.non_conformes, color: '#EF4444' },
    { name: 'Non audités', value: stats.total - (stats.conformes + stats.non_conformes), color: '#d1d5db' },
  ];

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
              <DocumentIcon className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          >
            Simplifiez la conformité réglementaire
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-500"
          >
            Gérez, auditez et suivez toutes vos réglementations en un seul endroit.
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <DocumentIcon className="h-10 w-10 text-red-600 mx-auto" />
                  <p className="mt-1 text-4xl font-extrabold text-red-600">{stats.non_conformes}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">Audits Non-Conformes</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg p-6 bg-white rounded-xl text-center transition-all duration-300 transform hover:scale-105">
                <CardContent className="space-y-2">
                  <BarChartIcon className="h-10 w-10 text-indigo-600 mx-auto" />
                  <p className="mt-1 text-4xl font-extrabold text-indigo-600">{stats.conformiteRate}%</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">Taux de Conformité</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="shadow-lg p-6 bg-white rounded-xl">
                  <CardHeader>
                    <CardTitle>Répartition de la conformité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Graphique en camembert */}
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={dataConformite}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          labelLine={false}
                          dataKey="value"
                        >
                          {dataConformite.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="shadow-lg p-6 bg-white rounded-xl h-full flex flex-col justify-center">
                  <CardContent className="pt-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Progression de l'audit</h3>
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
        
        {/* Nouvelle section: Activités récentes */}
        {user && recentAudits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-20"
          >
            <Card className="shadow-lg bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Activités récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAudits.map((audit, index) => (
                    <motion.div
                      key={audit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {audit.titre || 'Réglementation sans titre'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {audit.domaine} • Audité le {new Date(audit.updated_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Badge variant={audit.conformite === 'Conforme' ? 'default' : 'destructive'}>
                          {audit.conformite}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Nouvelle section: Avantages de l'application */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Pourquoi nous choisir ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-xl rounded-2xl p-8 bg-white/70 backdrop-blur-sm">
              <CardContent className="space-y-4 text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CloudIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Centralisation des données</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gardez toutes vos réglementations, audits et données de conformité dans un seul endroit sécurisé.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-xl rounded-2xl p-8 bg-white/70 backdrop-blur-sm">
              <CardContent className="space-y-4 text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Sécurité et fiabilité</h3>
                <p className="text-gray-600 leading-relaxed">
                  Notre plateforme assure la sécurité de vos données, garantissant un suivi fiable de votre conformité.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-xl rounded-2xl p-8 bg-white/70 backdrop-blur-sm">
              <CardContent className="space-y-4 text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUpIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Décisions éclairées</h3>
                <p className="text-gray-600 leading-relaxed">
                  Utilisez des tableaux de bord et des analyses pour identifier rapidement les risques et les opportunités.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Section des fonctionnalités (relocalisée) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Fonctionnalités clés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-xl rounded-2xl p-8 bg-white/70 backdrop-blur-sm">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Gestion des Réglementations</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Centralisez toutes vos réglementations pour les consulter, les auditer et les mettre à jour facilement. Organisez-les par domaine, priorité et propriétaire.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-xl rounded-2xl p-8 bg-white/70 backdrop-blur-sm">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChartIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Tableau de Bord de Conformité</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Obtenez une vue d'ensemble de la conformité de votre organisation avec des graphiques clairs et des statistiques en temps réel pour prendre des décisions éclairées.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Nouvelle section: Témoignages */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Ce que nos utilisateurs en disent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-xl rounded-2xl p-8 bg-white/70 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <QuoteIcon className="h-8 w-8 text-blue-600 mx-auto" />
                  <p className="text-gray-600 leading-relaxed italic text-center">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-center mt-4">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="bg-blue-600 rounded-2xl p-12 text-center text-white mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises qui font confiance à notre plateforme pour leur conformité réglementaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reglementations">
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
