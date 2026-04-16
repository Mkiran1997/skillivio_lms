import mongoose from "mongoose";

const lessonStatusSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enrollment",
    required: true,
    index: true
  },

  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
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

  status: {
    type: String,
    enum: ["not-started", "in-progress", "completed", "failed"],
    default: "not-started",
    index: true
  },

  progress: {
    timeSpent: {
      type: Number,
      default: 0
    },
    lastPosition: {
      type: Number,
      default: 0
    }
  },

  completedAt: {
    type: Date,
    default: null
  },

  assessment: {
    score: {
      type: Number,
      default: null
    },
    passed: {
      type: Boolean,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttemptAt: {
      type: Date,
      default: null
    }
  },

  notes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

lessonStatusSchema.index(
  { enrollmentId: 1, lessonId: 1 },
  { unique: true }
);
lessonStatusSchema.index({ learnerId: 1, courseId: 1 });
lessonStatusSchema.index({ enrollmentId: 1, status: 1 });

lessonStatusSchema.pre("save", function(next) {
  if (this.isModified("status") && this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

export default mongoose.models.LessonStatus ||
  mongoose.model("LessonStatus", lessonStatusSchema);