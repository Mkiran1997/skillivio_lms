import mongoose from "mongoose";
import user from "./user"; // <-- make sure this is imported
import course from "./course"
const enrollmentSchema = new mongoose.Schema({

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    saqaId: { type: String, required: true },
    intakeNo: { type: String, required: true },
    startDate: { type: Date, default: new Date().toISOString().split("T")[0] },
    endDate: { type: Date, default: "" },
    mode: { type: String, enum: ["Face-to-Face", "Blended", "Workplace-Based"], default: "Blended" },

    personal: {
        fullName: { type: String, required: true },
        idNumber: { type: String, required: true },
        dob: { type: String },
        gender: { type: String, enum: ["Male", "Female", "Non-binary", "Prefer not to say"] },
        nationality: { type: String, default: "South African" },
        address: { type: String, default: "" },
        contact: { type: String, default: "" },
        email: { type: String, default: "" },
    },

    employment: {
        employer: { type: String, default: "" },
        workAddress: { type: String, default: "" },
        contactPerson: { type: String, default: "" },
        contactNo: { type: String, default: "" },
        mentor: { type: String, enum: ["Yes", "No"], default: "No" },
    },

    enteyRequest: [
        {
            req: { type: String, default: "" },
            sub: { type: String, enum: ["Y", "N"], default: "N" },
            verBy: { type: String, default: "" },
            date: { type: String, default: "" },
        },
    ],

    assessment: {
        conducted: { type: String, enum: ["Yes", "No"], default: "No" },
        dateCond: { type: Date },
        outcome: { type: String, default: "Competent - Approved" },
        assessor: { type: String },
        sig: { type: String },
    },

    declaration: {
        name: { type: String, required: true },
        sig: { type: String, required: true },
        date: { type: String, default: new Date().toISOString().split("T")[0] },
        agreed: { type: Boolean, default: false },
    },

    popia: {
        consent: { type: Boolean, default: false },
        sig: { type: String, required: true },
        date: { type: String, default: new Date().toISOString().split("T")[0] },
    },

    provider: {
        verified: { type: String, enum: ["Yes", "No"], default: "No" },
        approved: { type: String, enum: ["Yes", "No"], default: "No" },
        qctoDate: { type: String, default: "" },
        repName: { type: String, default: "" },
        sig: { type: String, default: "" },
        date: { type: Date, default: new Date().toISOString().split("T")[0] },
    },

    docs: {
        certifiedId: { type: String },  // store file paths or URLs
        highestQual: { type: String },
        cv: { type: String },
        studyPermit: { type: String },
        workplaceConf: { type: String },
        entryAssessment: { type: String },
    },

}, { timestamps: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);