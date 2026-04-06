import mongoose from "mongoose";

const tenantsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  primary: { type: String, required: true },
  secondary: { type: String, required: true },
  accent: { type: String, required: true },
  logo: { type: String, required: true },
  tagline: { type: String, required: true },

  // Group general settings inside 'general'
  general: {
    supportEmail: { type: String, required: true },
    timeZone: { type: String, required: true },
    currency: { type: String, required: true },
  },

  QCTOConfig: {
    accreditationNumber: { type: String, required: true },
    setaAffiliation: { type: String, required: true },
    qctoAudit: { type: Boolean, default: true },
    autoGenerateQCTO: { type: Boolean, default: true },
  },

  tier: { type: String, required: true },
  contact: { type: String, required: true },
  domain: { type: String, required: true },
  email: { type: String, required: true },
  learners: { type: Number, required: true },// take as FK of learners
  mrr: { type: Number, required: true },
  color: { type: String, required: true },
  phone: { type: String, required: true },
  qctoNo: { type: String, required: true },
  status: { type: String, default: "Pending" },
  setupDate: { type: String, default: new Date().toISOString().split("T")[0] }

}, { timestamps: true });

export default mongoose.models.tenants || mongoose.model('tenants', tenantsSchema);