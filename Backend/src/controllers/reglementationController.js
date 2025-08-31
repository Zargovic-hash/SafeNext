import { pool } from "../db.js";

// 🔹 Recherche full-text + filtres avec données d'audit
export const getReglementation = async (req, res) => {
  try {
    const { search, titre, domaine, chapitre, sous_chapitre } = req.query;

    let filters = [];
    let values = [];
    let index = 1;

    if (domaine) {
      filters.push(`r.domaine = $${index++}`);
      values.push(domaine);
    }

    if (titre) {
      filters.push(`r.titre = $${index++}`);
      values.push(titre);
    }
    
    if (search) {
      filters.push(`to_tsvector('french', 
        coalesce(r.titre,'') || ' ' ||
        coalesce(r.exigence,'') || ' ' ||
        coalesce(r.lois,'') || ' ' ||
        coalesce(r.documents,'')
      ) @@ plainto_tsquery('french', $${index++})`);
      values.push(search);
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    
    // JOIN avec la table audit_conformite pour récupérer les données d'audit existantes
    const sql = `
      SELECT 
        r.id, r.domaine, r.chapitre, r.sous_chapitre, r.titre, r.exigence, r.lois, r.documents,
        a.conformite, a.risque, a.faisabilite, a.plan_action, a.deadline, a.owner
      FROM reglementation_all r
      LEFT JOIN audit_conformite a ON r.id = a.reglementation_id
      ${where}
      ORDER BY r.id;
    `;

    const { rows } = await pool.query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer tous les titres uniques
export const getTitres = async (req, res) => {
  try {
    const sql = `SELECT DISTINCT titre FROM reglementation_all ORDER BY titre;`;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer tous les domaines uniques
export const getDomaines = async (req, res) => {
  try {
    const sql = `SELECT DISTINCT domaine FROM reglementation_all ORDER BY domaine;`;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};