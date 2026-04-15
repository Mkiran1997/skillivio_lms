import mongoose from "mongoose";

const tenantsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true
    },

    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    phone: {
      type: String,
      required: true
    },

    logo: {
      type: String
    },

    tagline: {
      type: String
    },

    // Branding
    branding: {
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      accent: { type: String, required: true },
      color: { type: String }
    },

    // ⚙️ General Settings
    general: {
      supportEmail: { type: String, required: true },
      timeZone: { type: String, required: true },
      currency: { type: String, required: true }
    },

    // 🏛 QCTO Config
    QCTOConfig: {
      accreditationNumber: { type: String },
      setaAffiliation: { type: String },
      qctoAudit: { type: Boolean, default: true },
      autoGenerateQCTO: { type: Boolean, default: true }
    },

    // 💼 Business Info
    tier: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free"
    },

    mrr: {
      type: Number,
      default: 0
    },

    qctoNo: {
      type: String
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Suspended"],
      default: "Pending",
      index: true
    },

    setupDate: {
      type: Date,
      default: Date.now
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


// Indexes are declared natively within the schema properties above.


// Export Model
export default mongoose.models.tenants ||
  mongoose.model("tenants", tenantsSchema);