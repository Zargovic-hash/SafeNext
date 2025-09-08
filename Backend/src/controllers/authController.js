import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { pool } from "../db.js";

const SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = "24h";
const RESET_TOKEN_EXPIRES_IN = 15 * 60 * 1000; // 15 min

// ============================
// 🚀 Nodemailer Transporter
// ============================
const createTransporter = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      const testAccount = await nodemailer.createTestAccount();
      console.log("📧 Compte Ethereal généré:", testAccount.user);
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ SMTP non configuré.");
      return null;
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } catch (err) {
    console.error("❌ Erreur Nodemailer:", err);
    return null;
  }
};

// ============================
// 📧 Mot de passe oublié
// ============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });

    const { rows } = await pool.query(
      "SELECT id, email, first_name FROM users WHERE email=$1 AND is_active=true",
      [email]
    );

    if (rows.length === 0) {
      return res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
    }

    const user = rows[0];
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN);

    await pool.query("DELETE FROM password_reset_tokens WHERE user_id=$1", [user.id]);
    await pool.query("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1,$2,$3)", [
      user.id,
      resetToken,
      expiresAt,
    ]);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = await createTransporter();
    if (!transporter) return res.status(500).json({ error: "Service email indisponible" });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Bonjour ${user.first_name},</p>
        <p>Cliquez sur ce lien pour définir un nouveau mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expirera dans 15 minutes.</p>
      `,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("🔗 Aperçu du mail:", nodemailer.getTestMessageUrl(info));
    }

    res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
  } catch (err) {
    console.error("❌ Erreur forgotPassword:", err);
    res.status(500).json({ error: "Erreur lors de l'envoi du mail" });
  }
};

// ============================
// 🔄 Réinitialisation du mot de passe
// ============================
export const resetPassword = async (req, res) => {
  const client = await pool.connect();
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) return res.status(400).json({ error: "Mot de passe et confirmation requis" });
    if (password !== confirmPassword) return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
    if (password.length < 6) return res.status(400).json({ error: "Mot de passe trop court" });

    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT rt.user_id 
       FROM password_reset_tokens rt
       JOIN users u ON rt.user_id=u.id
       WHERE rt.token=$1 AND rt.expires_at>NOW() AND u.is_active=true`,
      [token]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    const { user_id } = rows[0];
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    await client.query("UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2", [password_hash, user_id]);
    await client.query("DELETE FROM password_reset_tokens WHERE user_id=$1", [user_id]);
    await client.query("COMMIT");

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Erreur resetPassword:", err);
    res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe" });
  } finally {
    client.release();
  }
};

// ============================
// 🔍 Vérifier validité token
// ============================
export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { rows } = await pool.query(
      `SELECT rt.expires_at 
       FROM password_reset_tokens rt
       JOIN users u ON rt.user_id=u.id
       WHERE rt.token=$1 AND rt.expires_at>NOW() AND u.is_active=true`,
      [token]
    );

    if (rows.length === 0) return res.status(400).json({ error: "Token invalide ou expiré" });
    res.json({ valid: true, expiresAt: rows[0].expires_at });
  } catch (err) {
    console.error("❌ Erreur validateResetToken:", err);
    res.status(500).json({ error: "Erreur validation token" });
  }
};

// ============================
// 📝 Inscription
// ============================
export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = "user" } = req.body;
    if (!email || !password || !first_name || !last_name)
      return res.status(400).json({ error: "Tous les champs sont requis" });
    if (password.length < 6) return res.status(400).json({ error: "Mot de passe trop court" });

    const existingUser = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existingUser.rows.length > 0) return res.status(400).json({ error: "Cet email est déjà utilisé" });

    const userRole = req.user?.role === "admin" && role === "admin" ? "admin" : "user";
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await pool.query(
      `INSERT INTO users (email,password_hash,first_name,last_name,role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,email,first_name,last_name,role,created_at`,
      [email, password_hash, first_name, last_name, userRole]
    );

    const newUser = rows[0];
    const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({ message: "Utilisateur créé", token, user: newUser });
  } catch (err) {
    console.error("❌ Erreur register:", err);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};

// ============================
// 🔑 Connexion
// ============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

    const { rows } = await pool.query(
      "SELECT id,email,password_hash,first_name,last_name,role,is_active FROM users WHERE email=$1",
      [email]
    );

    if (rows.length === 0) return res.status(401).json({ error: "Identifiants invalides" });
    const user = rows[0];
    if (!user.is_active) return res.status(401).json({ error: "Compte désactivé" });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: "Identifiants invalides" });

    await pool.query("UPDATE users SET last_login=NOW() WHERE id=$1", [user.id]);

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ message: "Connexion réussie", token, user });
  } catch (err) {
    console.error("❌ Erreur login:", err);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

// ============================
// 👤 Profil utilisateur
// ============================
export const getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id,email,first_name,last_name,role,created_at,last_login FROM users WHERE id=$1",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Erreur getProfile:", err);
    res.status(500).json({ error: "Erreur récupération profil" });
  }
};

// ============================
// ✏️ Mise à jour profil
// ============================
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, current_password, new_password } = req.body;
    const userId = req.user.id;

    let updateFields = [];
    let values = [];
    let i = 1;

    if (first_name) {
      updateFields.push(`first_name=$${i++}`);
      values.push(first_name);
    }
    if (last_name) {
      updateFields.push(`last_name=$${i++}`);
      values.push(last_name);
    }

    if (new_password) {
      if (!current_password) return res.status(400).json({ error: "Mot de passe actuel requis" });

      const { rows } = await pool.query("SELECT password_hash FROM users WHERE id=$1", [userId]);
      const valid = await bcrypt.compare(current_password, rows[0].password_hash);
      if (!valid) return res.status(400).json({ error: "Mot de passe actuel incorrect" });
      if (new_password.length < 6) return res.status(400).json({ error: "Nouveau mot de passe trop court" });

      const newHash = await bcrypt.hash(new_password, SALT_ROUNDS);
      updateFields.push(`password_hash=$${i++}`);
      values.push(newHash);
    }

    if (updateFields.length === 0) return res.status(400).json({ error: "Aucune modification" });

    updateFields.push("updated_at=NOW()");
    values.push(userId);

    const { rows } = await pool.query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id=$${i} RETURNING id,email,first_name,last_name,role,updated_at`,
      values
    );

    res.json({ message: "Profil mis à jour", user: rows[0] });
  } catch (err) {
    console.error("❌ Erreur updateProfile:", err);
    res.status(500).json({ error: "Erreur mise à jour profil" });
  }
};

// ============================
// 🔓 Déconnexion
// ============================
export const logout = async (req, res) => {
  res.json({ message: "Déconnexion réussie" });
};
