import { pool } from "../db.js";

// 📊 Dashboard avec statistiques complètes
export const getDashboardStats = async (req, res) => {
  try {
    // Statistiques générales
    const totalReglementations = await pool.query('SELECT COUNT(*) as total FROM reglementation_all');
    const totalAudits = await pool.query('SELECT COUNT(*) as total FROM audit_conformite');
    
    // Répartition par conformité
    const conformiteStats = await pool.query(`
      SELECT conformite, COUNT(*) as count 
      FROM audit_conformite 
      WHERE conformite IS NOT NULL
      GROUP BY conformite
    `);

    // Répartition par risque
    const risqueStats = await pool.query(`
      SELECT risque, COUNT(*) as count 
      FROM audit_conformite 
      WHERE risque IS NOT NULL
      GROUP BY risque
    `);

    // Répartition par domaine
    const domaineStats = await pool.query(`
      SELECT r.domaine, 
             COUNT(*) as total,
             COUNT(a.id) as audites,
             COUNT(CASE WHEN a.conformite = 'Conforme' THEN 1 END) as conformes,
             COUNT(CASE WHEN a.conformite = 'Non Conforme' THEN 1 END) as non_conformes
      FROM reglementation_all r
      LEFT JOIN audit_conformite a ON r.id = a.reglementation_id
      GROUP BY r.domaine
      ORDER BY total DESC
    `);

    // Audits par responsable
    const ownerStats = await pool.query(`
      SELECT owner, COUNT(*) as count,
             COUNT(CASE WHEN conformite = 'Conforme' THEN 1 END) as conformes,
             COUNT(CASE WHEN conformite = 'Non Conforme' THEN 1 END) as non_conformes
      FROM audit_conformite 
      WHERE owner IS NOT NULL AND owner != ''
      GROUP BY owner
      ORDER BY count DESC
      LIMIT 10
    `);

    // Échéances proches (30 jours)
    const echeancesProches = await pool.query(`
      SELECT r.titre, r.domaine, a.deadline, a.owner, a.conformite
      FROM audit_conformite a
      JOIN reglementation_all r ON a.reglementation_id = r.id
      WHERE a.deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      AND a.conformite != 'Conforme'
      ORDER BY a.deadline ASC
    `);

    // Évolution mensuelle des audits
    const evolutionMensuelle = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as mois,
        COUNT(*) as nouveaux_audits
      FROM audit_conformite
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY mois DESC
    `);

    res.json({
      totaux: {
        reglementations: parseInt(totalReglementations.rows[0].total),
        audits: parseInt(totalAudits.rows[0].total),
        taux_audit: totalReglementations.rows[0].total > 0 
          ? Math.round((totalAudits.rows[0].total / totalReglementations.rows[0].total) * 100) 
          : 0
      },
      conformite: conformiteStats.rows,
      risque: risqueStats.rows,
      domaines: domaineStats.rows,
      responsables: ownerStats.rows,
      echeances_proches: echeancesProches.rows,
      evolution: evolutionMensuelle.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📈 Rapport d'audit détaillé
export const getAuditReport = async (req, res) => {
  try {
    const { domaine, owner, conformite, date_debut, date_fin } = req.query;
    
    let filters = [];
    let values = [];
    let index = 1;

    if (domaine) {
      filters.push(`r.domaine = $${index++}`);
      values.push(domaine);
    }
    
    if (owner) {
      filters.push(`a.owner = $${index++}`);
      values.push(owner);
    }
    
    if (conformite) {
      filters.push(`a.conformite = $${index++}`);
      values.push(conformite);
    }
    
    if (date_debut) {
      filters.push(`a.created_at >= $${index++}`);
      values.push(date_debut);
    }
    
    if (date_fin) {
      filters.push(`a.created_at <= $${index++}`);
      values.push(date_fin + ' 23:59:59');
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const sql = `
      SELECT 
        r.id, r.domaine, r.chapitre, r.sous_chapitre, r.titre, r.exigence,
        a.conformite, a.risque, a.faisabilite, a.plan_action, a.deadline, a.owner,
        a.created_at, a.updated_at
      FROM reglementation_all r
      JOIN audit_conformite a ON r.id = a.reglementation_id
      ${whereClause}
      ORDER BY a.updated_at DESC
    `;

    const { rows } = await pool.query(sql, values);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔄 Sauvegarde en lot
export const bulkSaveAudits = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { audits } = req.body; // Array d'audits
    
    if (!Array.isArray(audits) || audits.length === 0) {
      return res.status(400).json({ error: "Données invalides" });
    }

    await client.query('BEGIN');

    const results = [];
    
    for (const audit of audits) {
      const { reglementation_id, conformite, risque, faisabilite, plan_action, deadline, owner } = audit;
      
      if (!reglementation_id) continue;

      const sql = `
        INSERT INTO audit_conformite
          (reglementation_id, conformite, risque, faisabilite, plan_action, deadline, owner, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7, NOW(), NOW())
        ON CONFLICT (reglementation_id)
        DO UPDATE SET 
          conformite = EXCLUDED.conformite,
          risque = EXCLUDED.risque,
          faisabilite = EXCLUDED.faisabilite,
          plan_action = EXCLUDED.plan_action,
          deadline = EXCLUDED.deadline,
          owner = EXCLUDED.owner,
          updated_at = NOW()
        RETURNING *;
      `;

      const result = await client.query(sql, [
        reglementation_id,
        conformite || null,
        risque || null,
        faisabilite || null,
        plan_action || null,
        deadline || null,
        owner || null
      ]);

      results.push(result.rows[0]);
    }

    await client.query('COMMIT');
    res.json({ success: true, saved: results.length, audits: results });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la sauvegarde en lot" });
  } finally {
    client.release();
  }
};

// 📤 Export des données
export const exportAudits = async (req, res) => {
  try {
    const { format = 'csv', domaine, conformite } = req.query;
    
    let filters = [];
    let values = [];
    let index = 1;

    if (domaine) {
      filters.push(`r.domaine = ${index++}`);
      values.push(domaine);
    }
    
    if (conformite) {
      filters.push(`a.conformite = ${index++}`);
      values.push(conformite);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const sql = `
      SELECT 
        r.domaine as "Domaine",
        r.chapitre as "Chapitre",
        r.sous_chapitre as "Sous-Chapitre",
        r.titre as "Titre",
        r.exigence as "Exigence",
        a.conformite as "Conformité",
        a.risque as "Risque",
        a.faisabilite as "Faisabilité",
        a.plan_action as "Plan d'Action",
        a.deadline as "Échéance",
        a.owner as "Responsable",
        a.created_at as "Date Création",
        a.updated_at as "Dernière Modification"
      FROM reglementation_all r
      LEFT JOIN audit_conformite a ON r.id = a.reglementation_id
      ${whereClause}
      ORDER BY r.domaine, r.chapitre, r.sous_chapitre
    `;

    const { rows } = await pool.query(sql, values);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=audit_export.json');
      return res.json(rows);
    }

    // Format CSV par défaut
    if (rows.length === 0) {
      return res.status(404).json({ error: "Aucune donnée à exporter" });
    }

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          const value = row[header];
          return value ? `"${String(value).replace(/"/g, '""')}"` : '';
        }).join(',')
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=audit_export.csv');
    res.send('\ufeff' + csvContent); // BOM pour UTF-8

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'export" });
  }
};