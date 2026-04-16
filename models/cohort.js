import mongoose from "mongoose";

const cohortSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Cohort name is required"],
    trim: true,
    maxlength: [200]
  },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true
  },

  intakeNumber: {
    type: String,
    required: true,
    index: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["upcoming", "active", "completed", "cancelled"],
    default: "upcoming",
    index: true
  },

  maxLearners: {
    type: Number,
    default: 30
  },

  currentLearners: {
    type: Number,
    default: 0
  },

  notes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

cohortSchema.index({ tenantId: 1, courseId: 1, status: 1 });
cohortSchema.index({ tenantId: 1, startDate: 1 });

export default mongoose.models.Cohort || mongoose.model("Cohort", cohortSchema);