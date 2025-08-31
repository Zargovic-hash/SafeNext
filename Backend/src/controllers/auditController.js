import { pool } from "../db.js";

export const saveAudit = async (req, res) => {
  try {
    const { reglementation_id, conformite, risque, faisabilite, plan_action, deadline, owner } = req.body;

    console.log("📥 Données reçues:", req.body); // Debug

    if (!reglementation_id) {
      return res.status(400).json({ error: "reglementation_id manquant" });
    }

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

    const { rows } = await pool.query(sql, [
      reglementation_id,
      conformite || null,
      risque || null,
      faisabilite || null,
      plan_action || null,
      deadline || null,
      owner || null
    ]);

    console.log("✅ Audit sauvegardé:", rows[0]); // Debug
    
    res.json({ success: true, audit: rows[0] });
  } catch (err) {
    console.error("❌ Erreur sauvegarde audit:", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// Nouvelle fonction pour récupérer un audit spécifique
export const getAudit = async (req, res) => {
  try {
    const { reglementation_id } = req.params;
    
    const sql = `SELECT * FROM audit_conformite WHERE reglementation_id = $1;`;
    const { rows } = await pool.query(sql, [reglementation_id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Audit non trouvé" });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};