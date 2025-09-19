# 📊 Fonctionnalité de Génération de Rapports - SafeNext

## 🎯 Vue d'ensemble

La fonctionnalité de génération de rapports permet aux utilisateurs de créer et télécharger des rapports PDF et Excel à partir des données d'audit, de réglementation et de dashboard.

## 🚀 Installation

### 1. Installer les Dépendances

```bash
# Backend
cd Backend
npm install puppeteer exceljs moment

# Ou utiliser le script d'installation
./install-reports.sh
```

### 2. Configuration des Variables d'Environnement

Ajoutez ces variables dans votre fichier `Backend/.env` :

```env
# Configuration requise pour les rapports
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
FRONTEND_URL=http://localhost:3000

# Configuration optionnelle pour les emails (si vous voulez envoyer les rapports par email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📋 Types de Rapports Disponibles

### 1. **Rapport Dashboard** 📈
- **Données incluses :** Statistiques générales, répartition par domaine, graphiques
- **Utilisation :** Page Recap (Tableau de Bord)
- **Filtres disponibles :** Date de début/fin, domaine

### 2. **Rapport Audit** 🔍
- **Données incluses :** Détail des audits avec conformité, risques, actions
- **Utilisation :** Page Réglementation (audits existants)
- **Filtres disponibles :** Domaine, conformité, responsable, dates, recherche textuelle

### 3. **Rapport Réglementation** 📋
- **Données incluses :** Liste des réglementations avec statut d'audit
- **Utilisation :** Page Réglementation
- **Filtres disponibles :** Domaine, titre, recherche textuelle

## 📄 Formats de Sortie

### **PDF** 📄
- Mise en page professionnelle avec en-têtes et pieds de page
- Graphiques et tableaux formatés
- Compatible avec tous les navigateurs
- Taille optimisée pour l'impression

### **Excel** 📊
- Données structurées dans des feuilles de calcul
- Graphiques intégrés (pour les rapports dashboard)
- Formatage automatique des cellules
- Compatible avec Excel, LibreOffice, Google Sheets

## 🎨 Interface Utilisateur

### Composants Frontend

1. **ReportButton** - Bouton de génération de rapport
2. **ReportModal** - Modal de configuration des rapports
3. **ReportFilters** - Composant de filtres pour les rapports

### Intégration dans les Pages

- **Page Recap :** Bouton "📊 Rapport Dashboard" dans le header
- **Page Réglementation :** Bouton "📊 Rapport" dans la barre d'outils

## 🔧 API Backend

### Endpoints Disponibles

```
POST /api/reports/pdf
POST /api/reports/excel
GET  

```

### Paramètres de Requête

```json
{
  "type": "audit|dashboard|reglementation",
  "filters": {
    "domaine": "string",
    "conformite": "string",
    "owner": "string",
    "date_debut": "YYYY-MM-DD",
    "date_fin": "YYYY-MM-DD",
    "search": "string"
  }
}
```

### Réponse

- **Succès :** Fichier binaire (PDF ou Excel)
- **Erreur :** JSON avec message d'erreur

## 🛡️ Sécurité

### Authentification
- Tous les endpoints nécessitent un token JWT valide
- Vérification des permissions utilisateur
- Filtrage automatique par utilisateur (non-admin)

### Validation des Données
- Validation des paramètres d'entrée
- Protection contre l'injection SQL
- Limitation de la taille des requêtes

## 📊 Exemples d'Utilisation

### Génération d'un Rapport PDF

```javascript
// Frontend
const generatePDF = async () => {
  const response = await fetch('/api/reports/pdf', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'audit',
      filters: {
        domaine: 'Sécurité',
        conformite: 'Non Conforme'
      }
    })
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'rapport_audit.pdf';
  link.click();
};
```

### Génération d'un Rapport Excel

```javascript
// Frontend
const generateExcel = async () => {
  const response = await fetch('/api/reports/excel', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'dashboard',
      filters: {}
    })
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'rapport_dashboard.xlsx';
  link.click();
};
```

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur "Puppeteer failed to launch"**
   - Solution : Installer les dépendances système pour Puppeteer
   - Linux : `sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`

2. **Erreur "ExcelJS module not found"**
   - Solution : Réinstaller les dépendances backend
   - `cd Backend && npm install exceljs`

3. **PDF généré vide**
   - Vérifier que les données existent dans la base
   - Vérifier les filtres appliqués
   - Consulter les logs du serveur

### Logs et Debug

Les logs sont disponibles dans la console du serveur :
- Génération de rapport : `📊 Génération rapport PDF/Excel`
- Erreurs : `❌ Erreur génération PDF/Excel`

## 🚀 Améliorations Futures

### Fonctionnalités Prévues

1. **Envoi par Email** 📧
   - Envoi automatique des rapports par email
   - Templates d'email personnalisables

2. **Planification** ⏰
   - Génération automatique de rapports périodiques
   - Notifications par email

3. **Personnalisation** 🎨
   - Templates de rapport personnalisables
   - Logos et couleurs d'entreprise

4. **Export Avancé** 📊
   - Format PowerPoint
   - Export vers Google Drive/Dropbox
   - API REST pour intégration externe

## 📞 Support

En cas de problème :

1. Vérifiez les logs du serveur
2. Testez avec des données simples
3. Vérifiez la configuration des variables d'environnement
4. Consultez la documentation des dépendances (Puppeteer, ExcelJS)

---

*Fonctionnalité développée pour SafeNext v2.1*
