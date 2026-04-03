import mongoose from "mongoose";
const learnersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    cohort: { type: String, required: true },
    enrolled: { type: Number, required: true },
    completed: { type: Number, required: true },
    credits: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.learners || mongoose.model('learners', learnersSchema);
    