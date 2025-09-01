import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: String(process.env.PG_USER),
  password: String(process.env.PG_PASSWORD),
  host: String(process.env.PG_HOST),
  port: Number(process.env.PG_PORT),
  database: String(process.env.PG_DATABASE)
});
console.log("PG_HOST:", process.env.PG_HOST);

// Fermeture propre du pool
process.on("SIGINT", async () => {
  await pool.end();
  console.log("🔒 Database connection closed");
  process.exit();
});
