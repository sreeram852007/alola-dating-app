const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  text:    { type: String, maxlength: 2000 },
  read:    { type: Boolean, default: false },
  type:    { type: String, enum: ["text", "image", "gif", "emoji"], default: "text" },
}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);
