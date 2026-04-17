import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson title is required"],
    trim: true,
    maxlength: [300, "Lesson title cannot exceed 300 characters"],
    index: "text"
  },

  description: {
    type: String,
    default: null,
    maxlength: 2000
  },

  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
    index: true
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

  type: {
    type: String,
    enum: ["video", "text", "assessment", "document", "interactive", "pdf", "image", "audio"],
    default: "text",
    index: true
  },

  order: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },

  content: {
    text: {
      type: String,
      default: null
    },
    video: {
      url: String,
      duration: Number,
      thumbnail: String,
      provider: {
        type: String,
        enum: ["upload", "youtube", "vimeo", "external"],
        default: "upload"
      }
    },
    document: {
      url: String,
      filename: String,
      fileType: String,
      fileSize: Number
    },
    assessment: {
      questions: [{
        question: String,
        type: {
          type: String,
          enum: ["multiple-choice", "true-false", "short-answer"],
          default: "multiple-choice"
        },
        options: [String],
        correctAnswer: String,
        points: { type: Number, default: 1 }
      }],
      passingScore: Number,
      timeLimit: Number
    }
  },

  thumbnail: {
    type: String,
    default: null
  },

  duration: {
    type: Number,
    default: 0
  },

  points: {
    type: Number,
    default: 1
  },

  isPublished: {
    type: Boolean,
    default: true
  },

  isFree: {
    type: Boolean,
    default: false
  },

  dripDays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

lessonSchema.index({ moduleId: 1, order: 1 }, { unique: true });
lessonSchema.index({ courseId: 1, type: 1 });
lessonSchema.index({ tenantId: 1, isPublished: 1 });

if (mongoose.models.Lesson) {
  delete mongoose.models.Lesson;
}
export default mongoose.model("Lesson", lessonSchema);