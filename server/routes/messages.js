const router = require("express").Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "alola_super_secret_key_2025";

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

// GET /api/messages/:matchId
router.get("/:matchId", auth, (req, res) => {
  res.json({ messages: [] });
});

// POST /api/messages/:matchId
router.post("/:matchId", auth, (req, res) => {
  const { text } = req.body;
  res.json({ message: { id: Date.now(), text, timestamp: new Date(), sent: true } });
});

module.exports = router;
