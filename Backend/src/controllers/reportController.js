// controllers/reportController.js
import { pool } from "../db.js";
import puppeteer from "puppeteer";
import ExcelJS from "exceljs";
import moment from "moment";

// ============================
// 📊 GÉNÉRATION RAPPORT PDF
// ============================
export const generatePDFReport = async (req, res) => {
  try {
    const { type, filters = {} } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    console.log(`📊 Génération rapport PDF - Type: ${type}, Utilisateur: ${userId}`);

    // Récupérer les données selon le type de rapport
    let data, title, filename;
    
    switch (type) {
      case 'audit':
        ({ data, title, filename } = await getAuditData(filters, userId, isAdmin));
        break;
      case 'dashboard':
        ({ data, title, filename } = await getDashboardData(filters, userId, isAdmin));
        break;
      case 'reglementation':
        ({ data, title, filename } = await getReglementationData(filters, userId, isAdmin));
        break;
      default:
        return res.status(400).json({ error: "Type de rapport non supporté" });
    }

    // Générer le HTML pour le PDF
    const html = generateHTMLReport(data, title, type, filters);

    // Créer le PDF avec Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    await browser.close();

    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error("❌ Erreur génération PDF:", err.message);
    res.status(500).json({ error: "Erreur lors de la génération du rapport PDF" });
  }
};

// ============================
// 📈 GÉNÉRATION RAPPORT EXCEL
// ============================
export const generateExcelReport = async (req, res) => {
  try {
    const { type, filters = {} } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    console.log(`📈 Génération rapport Excel - Type: ${type}, Utilisateur: ${userId}`);

    // Récupérer les données selon le type de rapport
    let data, title, filename;
    
    switch (type) {
      case 'audit':
        ({ data, title, filename } = await getAuditData(filters, userId, isAdmin));
        break;
      case 'dashboard':
        ({ data, title, filename } = await getDashboardData(filters, userId, isAdmin));
        break;
      case 'reglementation':
        ({ data, title, filename } = await getReglementationData(filters, userId, isAdmin));
        break;
      default:
        return res.status(400).json({ error: "Type de rapport non supporté" });
    }

    // Créer le workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    // Configurer les colonnes selon le type de données
    configureExcelColumns(worksheet, type, data);

    // Ajouter les données
    addExcelData(worksheet, data, type);

    // Appliquer le style
    applyExcelStyling(worksheet, type);

    // Générer le buffer Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Envoyer le fichier Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (err) {
    console.error("❌ Erreur génération Excel:", err.message);
    res.status(500).json({ error: "Erreur lors de la génération du rapport Excel" });
  }
};

// ============================
// 📋 RÉCUPÉRATION DES DONNÉES D'AUDIT
// ============================
const getAuditData = async (filters, userId, isAdmin) => {
  let filtersArray = [];
  let values = [];
  let index = 1;

  // Pour les non-admins, filtrer automatiquement par leur user_id
  if (!isAdmin) {
    filtersArray.push(`a.user_id = $${index++}`);
    values.push(userId);
  } else if (filters.user_id) {
    filtersArray.push(`a.user_id = $${index++}`);
    values.push(filters.user_id);
  }

  if (filters.domaine) {
    filtersArray.push(`r.domaine = $${index++}`);
    values.push(filters.domaine);
  }

  if (filters.conformite) {
    filtersArray.push(`a.conformite = $${index++}`);
    values.push(filters.conformite);
  }

  if (filters.date_debut) {
    filtersArray.push(`a.created_at >= $${index++}`);
    values.push(filters.date_debut);
  }

  if (filters.date_fin) {
    filtersArray.push(`a.created_at <= $${index++}`);
    values.push(filters.date_fin + ' 23:59:59');
  }

  const whereClause = filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';

  const sql = `
    SELECT 
      r.id, r.domaine, r.chapitre, r.sous_chapitre, r.titre, r.exigence,
      a.conformite, a.faisabilite, a.faisabilite, a.plan_action, a.deadline, a.owner,
      a.created_at, a.updated_at, a.user_id,
      u.first_name, u.last_name, u.email as user_email
    FROM reglementation_all r
    JOIN audit_conformite a ON r.id = a.reglementation_id
    LEFT JOIN users u ON a.user_id = u.id
    ${whereClause}
    ORDER BY a.updated_at DESC
  `;

  const { rows } = await pool.query(sql, values);

  return {
    data: rows,
    title: 'Rapport d\'Audit Réglementaire',
    filename: `rapport_audit_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`
  };
};

// ============================
// 📊 RÉCUPÉRATION DES DONNÉES DASHBOARD
// ============================
const getDashboardData = async (filters, userId, isAdmin) => {
  // Statistiques générales
  const statsQuery = `
    SELECT 
      COUNT(*) as total_audits,
      COUNT(CASE WHEN conformite = 'Conforme' THEN 1 END) as conformes,
      COUNT(CASE WHEN conformite = 'Non Conforme' THEN 1 END) as non_conformes,
      COUNT(CASE WHEN conformite = 'En Cours' THEN 1 END) as en_cours,
      COUNT(CASE WHEN conformite = 'Non Applicable' THEN 1 END) as non_applicables
    FROM audit_conformite a
    ${!isAdmin ? 'WHERE a.user_id = $1' : ''}
  `;

  const statsValues = !isAdmin ? [userId] : [];
  const { rows: stats } = await pool.query(statsQuery, statsValues);

  // Données par domaine
  const domainQuery = `
    SELECT 
      r.domaine,
      COUNT(*) as total,
      COUNT(CASE WHEN a.conformite = 'Conforme' THEN 1 END) as conformes,
      COUNT(CASE WHEN a.conformite = 'Non Conforme' THEN 1 END) as non_conformes
    FROM reglementation_all r
    JOIN audit_conformite a ON r.id = a.reglementation_id
    ${!isAdmin ? 'WHERE a.user_id = $1' : ''}
    GROUP BY r.domaine
    ORDER BY r.domaine
  `;

  const { rows: domains } = await pool.query(domainQuery, statsValues);

  return {
    data: { stats: stats[0], domains },
    title: 'Rapport Dashboard',
    filename: `rapport_dashboard_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`
  };
};

// ============================
// 📋 RÉCUPÉRATION DES DONNÉES RÉGLEMENTATION
// ============================
const getReglementationData = async (filters, userId, isAdmin) => {
  let filtersArray = [];
  let values = [];
  let index = 1;

  if (filters.domaine) {
    filtersArray.push(`r.domaine = $${index++}`);
    values.push(filters.domaine);
  }

  if (filters.titre) {
    filtersArray.push(`r.titre = $${index++}`);
    values.push(filters.titre);
  }

  if (filters.search) {
    filtersArray.push(`to_tsvector('french', 
      coalesce(r.titre,'') || ' ' ||
      coalesce(r.exigence,'') || ' ' ||
      coalesce(r.lois,'') || ' ' ||
      coalesce(r.documents,'')
    ) @@ plainto_tsquery('french', $${index++})`);
    values.push(filters.search);
  }

  const whereClause = filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';

  const sql = `
    SELECT 
      r.id, r.domaine, r.chapitre, r.sous_chapitre, r.titre, r.exigence, r.lois, r.documents,
      a.conformite, a.faisabilite, a.faisabilite, a.plan_action, a.deadline, a.owner
    FROM reglementation_all r
    LEFT JOIN audit_conformite a ON r.id = a.reglementation_id ${!isAdmin ? `AND a.user_id = ${userId}` : ''}
    ${whereClause}
    ORDER BY r.id
  `;

  const { rows } = await pool.query(sql, values);

  return {
    data: rows,
    title: 'Rapport Réglementation',
    filename: `rapport_reglementation_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`
  };
};

// ============================
// 🎨 GÉNÉRATION HTML POUR PDF
// ============================
const generateHTMLReport = (data, title, type, filters) => {
  const currentDate = moment().format('DD/MM/YYYY à HH:mm');
  
  let content = '';
  
  if (type === 'dashboard') {
    content = generateDashboardHTML(data, filters);
  } else if (type === 'audit') {
    content = generateAuditHTML(data, filters);
  } else {
    content = generateReglementationHTML(data, filters);
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #3b82f6; 
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .header h1 { 
          color: #3b82f6; 
          margin: 0; 
          font-size: 24px;
        }
        .header p { 
          color: #666; 
          margin: 5px 0 0 0; 
          font-size: 14px;
        }
        .filters { 
          background: #f8f9fa; 
          padding: 15px; 
          border-radius: 5px; 
          margin-bottom: 20px;
          font-size: 12px;
        }
        .filters h3 { 
          margin: 0 0 10px 0; 
          color: #495057;
        }
        .filters span { 
          background: #e9ecef; 
          padding: 2px 8px; 
          border-radius: 3px; 
          margin-right: 5px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
          font-size: 12px;
        }
        th, td { 
          border: 1px solid #dee2e6; 
          padding: 8px; 
          text-align: left;
        }
        th { 
          background: #3b82f6; 
          color: white; 
          font-weight: bold;
        }
        tr:nth-child(even) { 
          background: #f8f9fa; 
        }
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 15px; 
          margin-bottom: 20px;
        }
        .stat-card { 
          background: #f8f9fa; 
          padding: 15px; 
          border-radius: 5px; 
          text-align: center;
          border-left: 4px solid #3b82f6;
        }
        .stat-number { 
          font-size: 24px; 
          font-weight: bold; 
          color: #3b82f6;
        }
        .stat-label { 
          font-size: 12px; 
          color: #666; 
          margin-top: 5px;
        }
        .footer { 
          margin-top: 30px; 
          text-align: center; 
          font-size: 10px; 
          color: #666;
          border-top: 1px solid #dee2e6;
          padding-top: 10px;
        }
        .page-break { 
          page-break-before: always; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Généré le ${currentDate}</p>
        <p>SafeNext - Système d'Audit Réglementaire</p>
      </div>
      
      ${Object.keys(filters).length > 0 ? `
        <div class="filters">
          <h3>Filtres appliqués :</h3>
          ${Object.entries(filters).map(([key, value]) => 
            `<span><strong>${key}:</strong> ${value}</span>`
          ).join('')}
        </div>
      ` : ''}
      
      ${content}
      
      <div class="footer">
        <p>Rapport généré automatiquement par SafeNext</p>
        <p>© ${new Date().getFullYear()} SafeNext - Tous droits réservés</p>
      </div>
    </body>
    </html>
  `;
};

// ============================
// 📊 HTML POUR DASHBOARD
// ============================
const generateDashboardHTML = (data, filters) => {
  const { stats, domains } = data;
  
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${stats.total_audits}</div>
        <div class="stat-label">Total Audits</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.conformes}</div>
        <div class="stat-label">Conformes</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.non_conformes}</div>
        <div class="stat-label">Non Conformes</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.en_cours}</div>
        <div class="stat-label">En Cours</div>
      </div>
    </div>
    
    <h3>Répartition par Domaine</h3>
    <table>
      <thead>
        <tr>
          <th>Domaine</th>
          <th>Total</th>
          <th>Conformes</th>
          <th>Non Conformes</th>
          <th>Taux de Conformité</th>
        </tr>
      </thead>
      <tbody>
        ${domains.map(domain => `
          <tr>
            <td>${domain.domaine}</td>
            <td>${domain.total}</td>
            <td>${domain.conformes}</td>
            <td>${domain.non_conformes}</td>
            <td>${domain.total > 0 ? Math.round((domain.conformes / domain.total) * 100) : 0}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

// ============================
// 📋 HTML POUR AUDIT
// ============================
const generateAuditHTML = (data, filters) => {
  return `
    <h3>Détail des Audits (${data.length} éléments)</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Domaine</th>
          <th>Titre</th>
          <th>Conformité</th>
          <th>faisabilite</th>
          <th>Responsable</th>
          <th>Échéance</th>
          <th>Date Création</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(audit => `
          <tr>
            <td>${audit.id}</td>
            <td>${audit.domaine}</td>
            <td>${audit.titre}</td>
            <td>${audit.conformite}</td>
            <td>${audit.faisabilite }</td>
            <td>${audit.owner}</td>
            <td>${audit.deadline ? moment(audit.deadline).format('DD/MM/YYYY') : 'N/A'}</td>
            <td>${moment(audit.created_at).format('DD/MM/YYYY')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

// ============================
// 📋 HTML POUR RÉGLEMENTATION
// ============================
const generateReglementationHTML = (data, filters) => {
  return `
    <h3>Réglementation (${data.length} éléments)</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Domaine</th>
          <th>Chapitre</th>
          <th>Sous-Chapitre</th>
          <th>Titre</th>
          <th>Exigence</th>
          <th>Conformité</th>
          <th>Plan d'Action</th>
          <th>Responsable</th>  
          <th>Echeance</th>      
        </tr>
      </thead>
      <tbody>
        ${data.map(reg => `
          <tr>
            <td>${reg.id}</td>
            <td>${reg.domaine}</td>
            <td>${reg.chapitre}</td>
            <td>${reg.sous_chapitre}</td>
            <td>${reg.titre}</td>
            <td>${reg.exigence ? reg.exigence.substring(0, 100) + '...' : 'N/A'}</td>
            <td>${reg.conformite || 'Non audité'}</td>
            <td>${reg.plan_action || 'N/A'}</td>
            <td>${reg.owner || 'N/A'}</td>
            <td>${reg.deadline ? moment(reg.deadline).format('DD/MM/YYYY') : 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

// ============================
// 📊 AJOUT DONNÉES EXCEL - CORRIGÉE MAIS GARDE VOTRE LOGIQUE
// ============================
const addExcelData = (worksheet, data, type) => {
  if (type === 'dashboard') {
    // Ajouter les statistiques générales
    worksheet.addRow(['STATISTIQUES GÉNÉRALES']);
    worksheet.addRow(['Total Audits', data.stats.total_audits]);
    worksheet.addRow(['Conformes', data.stats.conformes]);
    worksheet.addRow(['Non Conformes', data.stats.non_conformes]);
    worksheet.addRow(['En Cours', data.stats.en_cours]);
    worksheet.addRow(['Non Applicables', data.stats.non_applicables]);
    worksheet.addRow([]); // Ligne vide
    
    // Ajouter les données par domaine
    worksheet.addRow(['RÉPARTITION PAR DOMAINE']);
    worksheet.addRow(['Domaine', 'Total', 'Conformes', 'Non Conformes', 'Taux Conformité']);
    
    data.domains.forEach(domain => {
      worksheet.addRow([
        domain.domaine,
        domain.total,
        domain.conformes,
        domain.non_conformes,
        domain.total > 0 ? Math.round((domain.conformes / domain.total) * 100) + '%' : '0%'
      ]);
    });
  } else {
    // CORRECTION ICI : au lieu d'utiliser des objets, on utilise des tableaux comme votre logique originale
    data.forEach(row => {
      const excelRow = [];
      
      if (type === 'audit') {
        // Ordre exact selon configureExcelColumns pour audit
        excelRow.push(row.id);
        excelRow.push(row.domaine);
        excelRow.push(row.titre);
        excelRow.push(row.conformite || 'N/A');
        excelRow.push(row.faisabilite || 'N/A');
        excelRow.push(row.plan_action || 'N/A'); // AJOUTÉ
        excelRow.push(row.owner || 'N/A');       // AJOUTÉ
        excelRow.push(row.deadline ? moment(row.deadline).format('DD/MM/YYYY') : 'N/A');
        excelRow.push(moment(row.created_at).format('DD/MM/YYYY'));
        
      } else { // reglementation
        // Ordre exact selon configureExcelColumns pour reglementation
        excelRow.push(row.id);
        excelRow.push(row.domaine);
        excelRow.push(row.chapitre || 'N/A');
        excelRow.push(row.sous_chapitre || 'N/A');
        excelRow.push(row.titre);
        excelRow.push(row.exigence ? (row.exigence.length > 100 ? row.exigence.substring(0, 100) + '...' : row.exigence) : 'N/A');
        excelRow.push(row.conformite || 'Non audité');
        excelRow.push(row.plan_action || 'N/A');  // AJOUTÉ
        excelRow.push(row.owner || 'N/A');        // AJOUTÉ
        excelRow.push(row.deadline ? moment(row.deadline).format('DD/MM/YYYY') : 'N/A'); // AJOUTÉ
      }
      
      worksheet.addRow(excelRow);
    });
  }
};

// ============================
// 📊 CONFIGURATION COLONNES EXCEL - AVEC LES COLONNES MANQUANTES
// ============================
const configureExcelColumns = (worksheet, type, data) => {
  if (type === 'dashboard') {
    worksheet.columns = [
      { header: 'Domaine', key: 'domaine', width: 20 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Conformes', key: 'conformes', width: 12 },
      { header: 'Non Conformes', key: 'non_conformes', width: 15 },
      { header: 'Taux Conformité', key: 'taux', width: 15 }
    ];
  } else if (type === 'audit') {
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Domaine', key: 'domaine', width: 15 },
      { header: 'Titre', key: 'titre', width: 30 },
      { header: 'Conformité', key: 'conformite', width: 12 },
      { header: 'Faisabilité', key: 'faisabilite', width: 12 },
      { header: 'Plan d\'Action', key: 'plan_action', width: 25 }, // AJOUTÉ
      { header: 'Responsable', key: 'owner', width: 15 },
      { header: 'Échéance', key: 'deadline', width: 12 },
      { header: 'Date Création', key: 'created_at', width: 15 }
    ];
  } else { // reglementation
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Domaine', key: 'domaine', width: 15 },
      { header: 'Chapitre', key: 'chapitre', width: 15 },
      { header: 'Sous-Chapitre', key: 'sous_chapitre', width: 15 },
      { header: 'Titre', key: 'titre', width: 30 },
      { header: 'Exigence', key: 'exigence', width: 40 },
      { header: 'Conformité', key: 'conformite', width: 12 },
      { header: 'Plan d\'Action', key: 'plan_action', width: 25 }, // AJOUTÉ
      { header: 'Responsable', key: 'owner', width: 15 },         // AJOUTÉ
      { header: 'Échéance', key: 'deadline', width: 12 }         // AJOUTÉ
    ];
  }
};

// ============================
// 🎨 STYLISATION EXCEL
// ============================
const applyExcelStyling = (worksheet, type) => {
  // Style pour les en-têtes
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF3B82F6' }
  };

  // Bordures pour toutes les cellules
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Alignement
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });
};