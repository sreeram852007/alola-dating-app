const router = require("express").Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "alola_super_secret_key_2025";

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

// GET /api/matches
router.get("/", auth, (req, res) => {
  res.json({ matches: [] });
});

// DELETE /api/matches/:id (unmatch)
router.delete("/:id", auth, (req, res) => {
  res.json({ unmatched: true });
});

module.exports = router;
