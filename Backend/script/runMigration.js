// scripts/runMigration.js
import fs from "fs";
import path from "path";
import { pool } from "../src/db.js"; // <-- ajuste le chemin si nécessaire

const FILE = path.resolve("migrations/dump.sql");

async function run() {
  const client = await pool.connect();
  let sql;
  try {
    console.log("🔌 Lecture du fichier:", FILE);
    sql = fs.readFileSync(FILE, "utf8");

    console.log("⚙️ Taille du fichier SQL:", sql.length, "octets");
    console.log("🚀 Exécution du script SQL ... (cela peut prendre du temps)");

    // Exécution en une seule fois (marche pour la plupart des dumps simples)
    await client.query(sql);

    console.log("✅ Migration terminée avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors de la migration (exécution en une fois) :", err.message);

    // Fallback (tentative prudente) : exécuter par statements séparés par ';'
    // ATTENTION : ce fallback casse parfois les fonctions/dollar-quoted strings.
    try {
      console.log("🔁 Tentative de fallback : exécution statement par statement");
      const statements = sql.split(/;\s*(\r?\n)/g).map(s => s.trim()).filter(Boolean);

      for (const st of statements) {
        if (!st) continue;
        try {
          await client.query(st);
        } catch (e) {
          console.error("   ❌ Erreur statement:", e.message);
          // Ne pas throw — on continue pour tenter d'exécuter la suite
        }
      }
      console.log("✅ Fallback terminé (vérifie les logs pour erreurs individuelles)");
    } catch (e2) {
      console.error("❌ Fallback échoué :", e2.message);
    }
  } finally {
    client.release();
    // ne pas pool.end() si ton app continue à tourner ; si tu veux quitter : await pool.end();
    process.exit(0);
  }
}

run();
