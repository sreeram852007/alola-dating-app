const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  age: { type: Number, min: 18, max: 99 },
  bio: { type: String, maxlength: 500, default: "" },
  gender: { type: String, enum: ["man", "woman", "non-binary", "other"] },
  lookingFor: { type: String, enum: ["men", "women", "everyone"], default: "everyone" },
  photos: [{ type: String }],
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
    city: String,
    country: String,
  },
  interests: [{ type: String }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  superLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  passes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  discoverySettings: {
    distance: { type: Number, default: 50 },
    ageMin: { type: Number, default: 18 },
    ageMax: { type: Number, default: 50 },
    showMe: { type: Boolean, default: true },
  },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.index({ "location": "2dsphere" });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
