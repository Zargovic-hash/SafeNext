# 🔧 Guide de Dépannage - Génération de Rapports

## 🚨 Problèmes Courants et Solutions

### 1. **Erreur "Module not found"**

**Symptôme :** `Error: Cannot find module 'puppeteer'` ou `Error: Cannot find module 'exceljs'`

**Solution :**
```bash
cd Backend
npm install puppeteer exceljs moment
```

### 2. **Erreur "Puppeteer failed to launch"**

**Symptôme :** `Error: Failed to launch the browser process!`

**Solutions :**

#### Windows :
```bash
# Installer les dépendances système
npm install puppeteer --save
```

#### Linux :
```bash
# Installer les dépendances système
sudo apt-get update
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

#### macOS :
```bash
# Installer via Homebrew
brew install --cask google-chrome
```

### 3. **Erreur "JWT_SECRET not defined"**

**Symptôme :** `Error: JWT_SECRET is not defined`

**Solution :**
Ajoutez dans `Backend/.env` :
```env
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
```

### 4. **Erreur "Database connection failed"**

**Symptôme :** `Error: Database connection failed`

**Solution :**
Vérifiez votre `Backend/.env` :
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_SSL=false
```

### 5. **Rapport PDF vide ou corrompu**

**Causes possibles :**
- Données insuffisantes dans la base
- Erreur dans le HTML généré
- Problème de CSS

**Solutions :**
1. Vérifiez que vous avez des données dans votre base
2. Testez avec des filtres simples
3. Consultez les logs du serveur

### 6. **Rapport Excel ne s'ouvre pas**

**Causes possibles :**
- Fichier corrompu
- Problème de format MIME
- Données mal formatées

**Solutions :**
1. Vérifiez la taille du fichier (doit être > 0 bytes)
2. Testez avec un autre lecteur Excel
3. Vérifiez les logs du serveur

### 7. **Erreur CORS**

**Symptôme :** `Access to fetch at 'http://localhost:3001/api/reports/pdf' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution :**
Vérifiez la configuration CORS dans `Backend/src/app.js` :
```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  // ... autres origines
];
```

### 8. **Timeout de génération**

**Symptôme :** La génération prend trop de temps et timeout

**Solutions :**
1. Augmentez le timeout dans le frontend
2. Optimisez les requêtes SQL
3. Réduisez la quantité de données

### 9. **Erreur "AbortSignal.timeout is not a function"**

**Symptôme :** Erreur dans le navigateur

**Solution :**
Cette erreur est déjà corrigée dans le code. Si elle persiste, utilisez un navigateur plus récent.

## 🧪 Tests de Diagnostic

### 1. **Test de l'API**
```bash
# Test de l'endpoint de test
curl -X GET http://localhost:3001/api/reports/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. **Test de génération PDF**
```bash
curl -X POST http://localhost:3001/api/reports/pdf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"type":"dashboard","filters":{}}' \
  --output test-report.pdf
```

### 3. **Test de génération Excel**
```bash
curl -X POST http://localhost:3001/api/reports/excel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"type":"audit","filters":{}}' \
  --output test-report.xlsx
```

## 📊 Vérification des Données

### 1. **Vérifier les données d'audit**
```sql
SELECT COUNT(*) FROM audit_conformite;
SELECT COUNT(*) FROM reglementation_all;
```

### 2. **Vérifier les utilisateurs**
```sql
SELECT id, email, role FROM users WHERE is_active = true;
```

## 🔍 Logs de Debug

### 1. **Activer les logs détaillés**
Ajoutez dans `Backend/.env` :
```env
DEBUG=true
NODE_ENV=development
```

### 2. **Consulter les logs**
Les logs apparaissent dans la console du serveur :
- `📊 Génération rapport PDF/Excel`
- `❌ Erreur génération PDF/Excel`

## 🚀 Solutions Rapides

### 1. **Redémarrage complet**
```bash
# Arrêter le serveur
Ctrl+C

# Réinstaller les dépendances
cd Backend
rm -rf node_modules
npm install

# Redémarrer
npm run dev
```

### 2. **Test avec des données minimales**
```javascript
// Test avec un seul audit
const testData = {
  type: 'audit',
  filters: {
    domaine: 'Sécurité',
    conformite: 'Conforme'
  }
};
```

### 3. **Vérification de la configuration**
```bash
# Vérifier les variables d'environnement
cd Backend
node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET ? 'JWT_SECRET OK' : 'JWT_SECRET MANQUANT');"
```

## 📞 Support

Si les problèmes persistent :

1. **Vérifiez les logs** du serveur backend
2. **Testez avec des données simples**
3. **Vérifiez la configuration** des variables d'environnement
4. **Consultez la documentation** des dépendances (Puppeteer, ExcelJS)

---

*Guide de dépannage pour SafeNext v2.1*
