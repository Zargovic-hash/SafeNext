// routes/reglementation.js (VERSION MISE À JOUR)
import express from "express";
import { getReglementation, getTitres, getDomaines } from "../controllers/reglementationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Route recherche et filtres
router.get("/", getReglementation);

// Route pour récupérer les titres uniques
router.get("/titres", getTitres);

// Route pour récupérer les domaines uniques
router.get("/domaines", getDomaines);

export default router;