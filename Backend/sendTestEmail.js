// sendTestEmail.js
import nodemailer from "nodemailer";

// 🚀 Script d'envoi de test avec Ethereal
const main = async () => {
  try {
    // ✅ Génère un compte Ethereal automatiquement
    const testAccount = await nodemailer.createTestAccount();

    // ✅ Crée un transporteur avec le compte généré
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // TLS
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // ✅ Envoi d’un email test
    const info = await transporter.sendMail({
      from: '"Audit Réglementaire" <noreply@audit-reglementaire.com>',
      to: "test@example.com",
      subject: "Test d’envoi Nodemailer ✔",
      text: "Ceci est un email de test envoyé via Ethereal",
      html: "<b>Ceci est un email de test envoyé via Ethereal</b>",
    });

    console.log("✅ Message envoyé:", info.messageId);
    console.log("🔗 Aperçu du message:", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("❌ Erreur envoi email:", err);
  }
};

main();
