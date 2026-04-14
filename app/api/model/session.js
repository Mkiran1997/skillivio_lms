import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // referring to their users collection
      required: true,
    },
    refreshTokenHash: { type: String, required: true },
    userAgent: String,
    ipAddress: String,
    isValid: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.sessions || mongoose.model("sessions", sessionSchema);
