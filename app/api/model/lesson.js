import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    url: { type: String, default: "" },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "module",
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.lesson || mongoose.model("lesson", lessonSchema);
