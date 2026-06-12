const router = require("express").Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "alola_super_secret_key_2025";

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

// Sample profiles for demo
const PROFILES = [
  { _id: "p1", name: "Emma Watson", age: 25, bio: "Oxford grad living in London 📚", photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=700&fit=crop"], location: "London", distance: 2, interests: ["Books", "Plants", "Coffee"] },
  { _id: "p2", name: "Marcus", age: 29, bio: "Chef & food photographer 🍜", photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop"], location: "Paris", distance: 5, interests: ["Cooking", "Travel"] },
  { _id: "p3", name: "Priya Sharma", age: 27, bio: "Neuroscience PhD 🧠", photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop"], location: "Mumbai", distance: 1, interests: ["Science", "Yoga"] },
];

// GET /api/profiles
router.get("/", auth, (req, res) => {
  res.json({ profiles: PROFILES });
});

// GET /api/profiles/:id
router.get("/:id", auth, (req, res) => {
  const profile = PROFILES.find(p => p._id === req.params.id);
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.json({ profile });
});

// POST /api/profiles/:id/like
router.post("/:id/like", auth, (req, res) => {
  const isMatch = Math.random() > 0.5;
  res.json({ liked: true, isMatch, matchId: isMatch ? `match_${Date.now()}` : null });
});

// POST /api/profiles/:id/pass
router.post("/:id/pass", auth, (req, res) => {
  res.json({ passed: true });
});

// POST /api/profiles/:id/superlike
router.post("/:id/superlike", auth, (req, res) => {
  res.json({ superLiked: true, isMatch: true, matchId: `match_${Date.now()}` });
});

module.exports = router;
