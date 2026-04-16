import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  refreshTokenHash: {
    type: String,
    required: true,
    select: false
  },

  userAgent: {
    type: String,
    default: null
  },

  ipAddress: {
    type: String,
    default: null
  },

  device: {
    type: String,
    default: null
  },

  browser: {
    type: String,
    default: null
  },

  os: {
    type: String,
    default: null
  },

  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  isValid: {
    type: Boolean,
    default: true,
    index: true
  },

  expiresAt: {
    type: Date,
    required: true
  },

  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1, isValid: 1 });

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);