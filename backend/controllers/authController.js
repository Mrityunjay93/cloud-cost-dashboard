const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createToken = (userId) => jwt.sign(
  { id: userId },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

exports.register = async (req, res) => {

  try {

    const { name, email, password } = req.body || {};
    const cleanedName = (name || "").trim();
    const cleanedEmail = (email || "").trim().toLowerCase();

    if (!cleanedName || !cleanedEmail || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!emailPattern.test(cleanedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await findUserByEmail(cleanedEmail);

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(cleanedName, cleanedEmail, hashedPassword);
    const token = createToken(user.id);

    res.status(201).json({
      token,
      user,
      message: "Registration successful",
    });

  } catch (error) {

    console.error("register error:", error);
    res.status(500).json({ message: "Internal server error" });

  }

};

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body || {};
    const cleanedEmail = (email || "").trim().toLowerCase();

    if (!cleanedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!emailPattern.test(cleanedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await findUserByEmail(cleanedEmail);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: "Login successful",
    });

  } catch (error) {

    console.error("login error:", error);
    res.status(500).json({ message: "Internal server error" });

  }

};
