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
  }

}, { timestamps: true });

export default mongoose.models.tenants || mongoose.model('tenants', tenantsSchema);