const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  users:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  lastMsg:   { type: String, default: "" },
  lastMsgAt: { type: Date },
  unread:    { type: Map, of: Number, default: {} },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Match || mongoose.model("Match", matchSchema);
