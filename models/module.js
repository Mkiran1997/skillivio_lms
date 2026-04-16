import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Module name is required"],
    trim: true,
    maxlength: [300, "Module name cannot exceed 300 characters"]
  },

  description: {
    type: String,
    default: null,
    maxlength: 2000
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

  order: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },

  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  }],

  isOptional: {
    type: Boolean,
    default: false
  },

  isPublished: {
    type: Boolean,
    default: true
  },

  estimatedDuration: {
    type: Number,
    default: 0
  },

  weight: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  }
}, {
  timestamps: true
});

moduleSchema.index({ courseId: 1, order: 1 }, { unique: true });
moduleSchema.index({ tenantId: 1, courseId: 1 });

export default mongoose.models.Module || mongoose.model("Module", moduleSchema);