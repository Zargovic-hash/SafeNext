import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import DocumentIcon from '../icons/DocumentIcon';
import BarChartIcon from '../icons/BarChartIcon';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DocumentIcon className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Bienvenue {user?.first_name} 👋
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Gérez et suivez vos conformités réglementaires en toute simplicité. 
            Une plateforme complète pour vos audits et votre mise en conformité.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/reglementations">
              <Button size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
                <DocumentIcon className="h-5 w-5 mr-2" />
                Explorer les réglementations
              </Button>
            </Link>
            <Link to="/recap">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
                <BarChartIcon className="h-5 w-5 mr-2" />
                Voir mon récapitulatif
              </Button>
            </Link>
          </motion.div>

          {/* Statistiques rapides */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20"
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DocumentIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Réglementations référencées</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-600 text-xl font-bold">✓</div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600 font-medium">Taux de conformité</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="text-center py-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-purple-600 text-xl font-bold">24/7</div>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">Continu</div>
                <div className="text-gray-600 font-medium">Surveillance active</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fonctionnalités */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Fonctionnalités principales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="h-6 w-6 text-blue-600">🔍</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Recherche avancée</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Trouvez rapidement les réglementations qui vous concernent avec notre moteur de recherche intelligent et nos filtres avancés.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="h-6 w-6 text-green-600">🎯</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Filtrage par domaine</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Organisez vos réglementations par domaines d'activité pour une navigation optimale et un accès rapide aux informations pertinentes.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <BarChartIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Audit et suivi</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Réalisez vos audits de conformité et suivez l'évolution de vos performances avec des tableaux de bord intuitifs.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
                  En savoir plus
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;