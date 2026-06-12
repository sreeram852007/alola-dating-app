const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "alola_super_secret_key_2025";

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try { 
    req.user = jwt.verify(token, JWT_SECRET); 
    next(); 
  }
  catch { 
    res.status(401).json({ message: "Invalid token" }); 
  }
};

// GET /api/profiles - Get real users from database (no bots)
router.get("/", auth, async (req, res) => {
  try {
    // Get all users except the current user
    const users = await User.find({ 
      _id: { $ne: req.user.id } 
    }).select("-password");
    res.json({ profiles: users });
  } catch (err) {
    console.error("Error fetching profiles:", err);
    res.json({ profiles: [] });
  }
});

// GET /api/profiles/:id - Get specific user profile
router.get("/:id", auth, async (req, res) => {
  try {
    const profile = await User.findById(req.params.id).select("-password");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// POST /api/profiles/:id/like
router.post("/:id/like", auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });
    
    const currentUser = await User.findById(req.user.id);
    
    // Check if it's a match (both liked each other)
    const isMatch = currentUser.likes?.includes(req.params.id);
    
    if (isMatch) {
      // Create a match
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { matches: req.params.id }
      });
      await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { matches: req.user.id }
      });
    }
    
    // Add to likes
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { likes: req.params.id }
    });
    
    res.json({ liked: true, isMatch, matchId: isMatch ? `match_${Date.now()}` : null });
  } catch (err) {
    res.status(500).json({ message: "Error processing like" });
  }
});

// POST /api/profiles/:id/pass
router.post("/:id/pass", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { passes: req.params.id }
    });
    res.json({ passed: true });
  } catch (err) {
    res.status(500).json({ message: "Error processing pass" });
  }
});

// POST /api/profiles/:id/superlike
router.post("/:id/superlike", auth, async (req, res) => {
  try {
    // Superlike always creates a match
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { matches: req.params.id, superLikes: req.params.id }
    });
    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { matches: req.user.id }
    });
    
    res.json({ superLiked: true, isMatch: true, matchId: `match_${Date.now()}` });
  } catch (err) {
    res.status(500).json({ message: "Error processing superlike" });
  }
});

// GET /api/users/search - Search users by name
router.get("/search", auth, async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return res.json({ users: [] });
  }
  
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
      name: { $regex: q, $options: "i" }
    }).limit(20).select("-password");
    res.json({ users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

// PUT /api/users/profile - Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { bio, interests } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio, interests },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// GET /api/users/me - Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

module.exports = router;