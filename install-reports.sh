#!/bin/bash

# Script d'installation des dépendances pour la fonctionnalité de rapports
# SafeNext - Génération de rapports PDF et Excel

echo "🚀 Installation des dépendances pour la génération de rapports..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Installer les dépendances backend
echo "📦 Installation des dépendances backend..."
cd Backend
npm install puppeteer exceljs moment

# Vérifier l'installation
if [ $? -eq 0 ]; then
    echo "✅ Dépendances backend installées avec succès"
else
    echo "❌ Erreur lors de l'installation des dépendances backend"
    exit 1
fi

cd ..

echo ""
echo "🎉 Installation terminée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurez vos variables d'environnement dans Backend/.env"
echo "2. Redémarrez votre serveur backend: npm run dev"
echo "3. Testez la génération de rapports depuis l'interface"
echo ""
echo "📊 Types de rapports disponibles:"
echo "   - Rapport Dashboard (statistiques et graphiques)"
echo "   - Rapport Audit (détail des audits)"
echo "   - Rapport Réglementation (liste des réglementations)"
echo ""
echo "📄 Formats supportés:"
echo "   - PDF (avec mise en page professionnelle)"
echo "   - Excel (avec données structurées)"
echo ""
echo "🔧 Configuration requise:"
echo "   - JWT_SECRET dans .env"
echo "   - DATABASE_URL dans .env"
echo "   - FRONTEND_URL dans .env (pour les liens dans les PDF)"
echo ""
echo "✨ Fonctionnalité prête à utiliser!"
