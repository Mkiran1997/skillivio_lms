import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["learner", "admin", "superAdmin"], // allowed values
        default: "learner", // optional
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tenants", // Name of the model you defined for tenants
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.users || mongoose.model('users', userSchema);
