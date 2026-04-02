import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    cat: { type: String, default: "Technology" },
    level: { type: String, default: "BEGINNER" },
    nqf: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    free: { type: Boolean, default: true },  // ✅ Boolean, not string
    enrolled: { type: Number, default: 0 },
    lessons: { type: Number, default: 0 },
    desc: { type: String, default: "" },
    saqaId: { type: Number, default: 0 },
    passingScore: { type: Number, default: 0 },
    dripEnabled: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    status: { type: String, default: "DRAFT" },
    thumb: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);