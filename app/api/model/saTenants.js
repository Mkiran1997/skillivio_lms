import mongoose from "mongoose";
const saTenantsSchema = new mongoose.Schema({
    slug: { type: String, required: true },
    name: { type: String, required: true },
    tier: { type: String, required: true },
    contact: { type: String, required: true },
    domain: { type: String, required: true },
    email: { type: String, required: true },
    learners: { type: Number, required: true },// take as FK of learners
    mrr: { type: Number, required: true },
    color: { type: String, required: true },
    phone: { type: String, required: true },
    qctoNo: { type: String, required: true },
    seta: { type: String, required: true },
    logo: { type: String, required: true },
    status: { type: String, default: "Pending" },
    setupDate: { type: String, default: new Date().toISOString().split("T")[0] }
}, { timestamps: true });

export default mongoose.models.saTenants || mongoose.model('saTenants', saTenantsSchema);