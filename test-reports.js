// Script de test pour la fonctionnalité de rapports
// Exécuter avec: node test-reports.js

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

// Test de génération de rapport PDF
const testPDFReport = async () => {
  try {
    console.log('🧪 Test génération rapport PDF...');
    
    const response = await fetch(`${API_BASE}/reports/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Remplacez par un token valide
      },
      body: JSON.stringify({
        type: 'dashboard',
        filters: {}
      })
    });

    if (response.ok) {
      console.log('✅ Rapport PDF généré avec succès');
      const buffer = await response.buffer();
      console.log(`📄 Taille du fichier: ${buffer.length} bytes`);
    } else {
      const error = await response.json();
      console.log('❌ Erreur:', error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
};

// Test de génération de rapport Excel
const testExcelReport = async () => {
  try {
    console.log('🧪 Test génération rapport Excel...');
    
    const response = await fetch(`${API_BASE}/reports/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Remplacez par un token valide
      },
      body: JSON.stringify({
        type: 'audit',
        filters: {
          domaine: 'Sécurité'
        }
      })
    });

    if (response.ok) {
      console.log('✅ Rapport Excel généré avec succès');
      const buffer = await response.buffer();
      console.log(`📊 Taille du fichier: ${buffer.length} bytes`);
    } else {
      const error = await response.json();
      console.log('❌ Erreur:', error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
};

// Test de l'endpoint de test
const testReportEndpoint = async () => {
  try {
    console.log('🧪 Test endpoint de test...');
    
    const response = await fetch(`${API_BASE}/reports/test`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Remplacez par un token valide
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Endpoint de test fonctionne:', data);
    } else {
      const error = await response.json();
      console.log('❌ Erreur:', error);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
};

// Exécution des tests
const runTests = async () => {
  console.log('🚀 Démarrage des tests de rapports...\n');
  
  await testReportEndpoint();
  console.log('');
  
  await testPDFReport();
  console.log('');
  
  await testExcelReport();
  console.log('');
  
  console.log('✨ Tests terminés!');
};

runTests();
