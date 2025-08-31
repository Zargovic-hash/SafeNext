import express from "express";
import { saveAudit, getAudit } from "../controllers/auditController.js";

const router = express.Router();

// POST pour sauvegarder un audit
router.post("/", saveAudit);

// GET pour récupérer un audit spécifique
router.get("/:reglementation_id", getAudit);

export default router;