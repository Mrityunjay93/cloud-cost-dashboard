const { Pool } = require("pg");

const useSsl = String(process.env.DB_SSL || "false").toLowerCase() === "true";
const dbPassword = process.env.DB_PASSWORD || "";

if (process.env.NODE_ENV === "production" && !dbPassword) {
  throw new Error("DB_PASSWORD must be set in production");
}

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "cloudcost",
  password: dbPassword,
  port: Number(process.env.DB_PORT || 5432),
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
