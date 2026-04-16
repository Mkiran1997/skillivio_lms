import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enrollment",
    required: true,
    unique: true,
    index: true
  },

  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Learner",
    required: true,
    index: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true
  },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true
  },

  learnerName: {
    type: String,
    required: true
  },

  courseName: {
    type: String,
    required: true
  },

  issueDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  finalScore: {
    type: Number,
    default: null
  },

  nqfLevel: {
    type: Number,
    required: true
  },

  credits: {
    type: Number,
    required: true
  },

  qctoDetails: {
    qualificationId: String,
    issuedDate: String
  },

  pdfUrl: {
    type: String,
    default: null
  },

  isValid: {
    type: Boolean,
    default: true
  },

  revokedAt: {
    type: Date,
    default: null
  },
  revocationReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

certificateSchema.index({ certificateNumber: 1, isValid: 1 });
certificateSchema.index({ learnerId: 1, courseId: 1 });

certificateSchema.statics.generateNumber = function(tenantId, courseId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const tenantCode = tenantId.toString().slice(-4).toUpperCase();
  const courseCode = courseId.toString().slice(-4).toUpperCase();
  return `CERT-${tenantCode}-${courseCode}-${timestamp}`;
};

export default mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);