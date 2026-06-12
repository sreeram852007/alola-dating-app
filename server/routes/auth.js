const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "alola_super_secret_key_2025";

// Lazy-load User model (graceful if DB not connected)
let User;
try { User = require("../models/User"); } catch {}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password, name, age, gender, lookingFor } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email, password and name are required" });
  }
  if (age < 18) return res.status(400).json({ message: "Must be 18 or older" });

  try {
    if (!User) throw new Error("DB not available");
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashed, name, age, gender, lookingFor });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    // Demo fallback
    const mockUser = { _id: "demo_" + Date.now(), email, name, age, gender, lookingFor, photos: [], interests: [], matches: [] };
    const token = jwt.sign({ id: mockUser._id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: mockUser });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    if (!User) throw new Error("DB not available");
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "No account with that email" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: sanitize(user) });
  } catch {
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Unauthorized" });
  try {
    const { id } = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    if (!User) return res.status(500).json({ message: "DB not available" });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: sanitize(user) });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

function sanitize(u) {
  const obj = u.toObject ? u.toObject() : u;
  delete obj.password;
  return obj;
}

module.exports = router;
