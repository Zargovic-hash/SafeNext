#!/bin/bash

# Script de nettoyage des fichiers inutiles - SafeNext
echo "🧹 Nettoyage des fichiers inutiles..."

# Supprimer les fichiers backend inutiles
echo "📁 Suppression des fichiers backend inutiles..."
rm -f Backend/src/config.js

# Supprimer les composants frontend inutiles
echo "📁 Suppression des composants frontend inutiles..."
rm -f Frontend/src/components/rsetpassword.jsx
rm -f Frontend/src/components/SearchFilters.jsx
rm -f Frontend/src/components/DashboardStats.jsx
rm -f Frontend/src/components/ForgotPassword.jsx

# Supprimer le dossier client vide
echo "📁 Suppression du dossier client vide..."
rm -rf Frontend/client

# Optionnel : Supprimer le dossier build (décommentez si nécessaire)
# echo "📁 Suppression du dossier build..."
# rm -rf Frontend/build

echo "✅ Nettoyage terminé !"
echo ""
echo "📊 Fichiers supprimés :"
echo "   - Backend/src/config.js"
echo "   - Frontend/src/components/rsetpassword.jsx"
echo "   - Frontend/src/components/SearchFilters.jsx"
echo "   - Frontend/src/components/DashboardStats.jsx"
echo "   - Frontend/src/components/ForgotPassword.jsx"
echo "   - Frontend/client/ (dossier vide)"
echo ""
echo "💡 Le dossier Frontend/build/ a été conservé."
echo "   Vous pouvez le supprimer manuellement si vous le souhaitez."
echo "   Il sera régénéré lors du prochain build."
