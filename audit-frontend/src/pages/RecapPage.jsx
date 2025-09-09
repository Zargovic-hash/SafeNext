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

const RecapPage = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    audits: 0,
    conformes: 0,
    non_conformes: 0,
    en_retard: 0
  });
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!token) return;

      try {
        // Récupérer les audits de l'utilisateur
        const auditsResponse = await fetch(`${API_BASE}/audit`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (auditsResponse.ok) {
          const auditsData = await auditsResponse.json();
          setRecentAudits(auditsData.audits || []);
          
          // Calculer les statistiques
          const audits = auditsData.audits || [];
          const conformes = audits.filter(a => a.conformite === 'Conforme').length;
          const non_conformes = audits.filter(a => a.conformite === 'Non Conforme').length;
          const en_retard = audits.filter(a => 
            a.deadline && new Date(a.deadline) < new Date() && a.conformite !== 'Conforme'
          ).length;

          setStats({
            audits: audits.length,
            conformes,
            non_conformes,
            en_retard
          });
        }
      } catch (error) {
        console.error('Erreur récupération stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Récapitulatif</h1>
            <p className="text-gray-600 mt-2">Vue d'ensemble de vos activités d'audit</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DocumentIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total audits</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.audits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <div className="h-6 w-6 text-green-600">✓</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Conformes</p>
                      <p className="text-2xl font-bold text-green-600">{stats.conformes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <div className="h-6 w-6 text-red-600">✗</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Non conformes</p>
                      <p className="text-2xl font-bold text-red-600">{stats.non_conformes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <div className="h-6 w-6 text-orange-600">⚠</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">En retard</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.en_retard}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profil utilisateur */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5" />
                    <span>Profil utilisateur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {user?.first_name} {user?.last_name}
                      </h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <Badge variant="secondary" className="mt-2 capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Membre depuis</span>
                        <span className="font-medium">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dernière connexion</span>
                        <span className="font-medium">
                          {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Graphique de répartition */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChartIcon className="h-5 w-5" />
                    <span>Répartition des audits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.audits === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun audit réalisé</p>
                      <p className="text-sm mt-2">
                        Commencez par auditer des réglementations
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Conformes</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${(stats.conformes / stats.audits) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{Math.round((stats.conformes / stats.audits) * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Non conformes</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-red-500 rounded-full"
                              style={{ width: `${(stats.non_conformes / stats.audits) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{Math.round((stats.non_conformes / stats.audits) * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">En attente</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-gray-400 rounded-full"
                              style={{ width: `${((stats.audits - stats.conformes - stats.non_conformes) / stats.audits) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {Math.round(((stats.audits - stats.conformes - stats.non_conformes) / stats.audits) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Audits récents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Audits récents</CardTitle>
              </CardHeader>
              <CardContent>
                {recentAudits.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun audit récent</p>
                    <Link to="/reglementations">
                      <Button className="mt-4">
                        Commencer un audit
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentAudits.slice(0, 5).map((audit, index) => (
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
                            {audit.domaine} • {new Date(audit.updated_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="ml-4">
                          {audit.conformite ? (
                            <Badge variant={audit.conformite === 'Conforme' ? 'default' : 'destructive'}>
                              {audit.conformite}
                            </Badge>
                          ) : (
                            <Badge variant="outline">En attente</Badge>
                          )}
                        </div>
                      </motion.div>
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