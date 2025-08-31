import express from "express";
import { getReglementation, getTitres, getDomaines } from "../controllers/reglementationController.js";

const router = express.Router();

// Route recherche et filtres
router.get("/", getReglementation);

// Route pour récupérer les titres uniques
router.get("/titres", getTitres);

// Route pour récupérer les domaines uniques
router.get("/domaines", getDomaines);

export default router;
