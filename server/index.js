const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date(), message: 'Alola Dating App is running!' });
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Database ────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/alola";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.warn("⚠️  MongoDB not available — running in demo mode:", err.message));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profiles", require("./routes/profiles"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/messages", require("./routes/messages"));

// ── Serve React frontend ────────────────────────────────────
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(publicDir, "index.html"));
  }
});

// ── Socket.IO for Real-time Chat ────────────────────────────
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("send_message", (data) => {
    const { to, from, text, matchId } = data;
    const recipientSocket = onlineUsers.get(to);
    if (recipientSocket) {
      io.to(recipientSocket).emit("receive_message", {
        from, text, matchId,
        timestamp: new Date().toISOString(),
      });
    }
    // Optionally save to DB
    socket.emit("message_sent", { id: Date.now(), ...data });
  });

  socket.on("typing", ({ to, from }) => {
    const recipientSocket = onlineUsers.get(to);
    if (recipientSocket) io.to(recipientSocket).emit("user_typing", { from });
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    }
  });
});

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
🌸 Alola Dating App Server
━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Running on: http://localhost:${PORT}
🌍 Open in browser to use the app
━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
