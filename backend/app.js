const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

const app = express();

const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin ? normalizeOrigin(origin) : "";

    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS not allowed"));
  },
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Cloud Cost Monitoring API Running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/resources", resourceRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.connect()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB connection error:", err));
