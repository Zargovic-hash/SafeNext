// app.js (VERSION MISE À JOUR)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reglementationRoutes from "./routes/reglementation.js";
import auditRoutes from "./routes/audit.js";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import { pool } from "./db.js";

dotenv.config();
const app = express();

// Vérification des variables d'environnement critiques
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET n'est pas défini dans les variables d'environnement");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);           // 🔐 Authentification
app.use("/api/users", usersRoutes);         // 👥 Gestion des utilisateurs (Admin)
app.use("/api/reglementation", reglementationRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Route test avec informations système
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API Audit Réglementaire v2.1",
    version: "2.1.0",
    timestamp: new Date().toISOString(),
    features: ["Multi-utilisateurs", "Authentification JWT", "Gestion des permissions"],
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      reglementation: "/api/reglementation",
      audit: "/api/audit", 
      dashboard: "/api/dashboard"
    }
  });
});

// Route de santé
app.get("/health", async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: "healthy", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: "unhealthy", 
      database: "disconnected",
      error: err.message
    });
  }
});

// Gestionnaire d'erreur global
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ 
    error: "Erreur interne du serveur",
    timestamp: new Date().toISOString()
  });
});

// Gestionnaire 404
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route non trouvée",
    path: req.path,
    method: req.method
  });
});

// Test connexion DB
pool.connect()
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => console.error("❌ Database connection error:", err.stack));


export default app;