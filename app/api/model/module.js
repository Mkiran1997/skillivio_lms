import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    moduleName: { type: String, require: true },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.module || mongoose.model("module", moduleSchema);
