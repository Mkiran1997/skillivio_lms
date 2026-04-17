import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    trim: true,
    maxlength: [300, "Title cannot exceed 300 characters"],
    index: "text"
  },

  description: {
    type: String,
    default: null,
    maxlength: 5000
  },

  category: {
    type: String,
    enum: [
      "technology", "management", "finance", "marketing", "hr",
      "operations", "healthcare", "construction", "agriculture", "retail",
      "hospitality", "legal", "education", "other"
    ],
    default: "other",
    index: true
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
    index: true
  },

  nqfLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
    index: true
  },

  credits: {
    type: Number,
    min: 0,
    max: 240,
    default: 0,
    index: true
  },

  saqaId: {
    type: String,
    default: null
  },

  isFree: {
    type: Boolean,
    default: true,
    index: true
  },

  price: {
    type: Number,
    min: 0,
    default: 0
  },

  vatInclusive: {
    type: Boolean,
    default: false
  },

  setaAffiliation: {
    type: String,
    default: null
  },

  thumbnail: {
    type: String,
    default: null
  },
  previewVideo: {
    type: String,
    default: null
  },

  type: {
    type: String,
    required: true,
    index: true
  },

  dripEnabled: {
    type: Boolean,
    default: false
  },

  dripDays: {
    type: Number,
    default: 7
  },

  passingScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 75
  },

  hasFinalAssessment: {
    type: Boolean,
    default: true
  },

  issueCertificate: {
    type: Boolean,
    default: true
  },

  certificateTemplate: {
    type: String,
    default: "default"
  },

  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module"
  }],

  materials: [{
    url: String,
    filename: String,
    size: String,
    fileType: { type: String, enum: ["PDF", "PPTX", "XLSX", "DOCX", "OTHER", "ZIP", "MP4"], default: "OTHER" },
    desc: String
  }],

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["draft", "published", "archived", "hidden"],
    default: "draft",
    index: true
  },

  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],

  learningOutcomes: [{
    type: String
  }],

  enrollmentCount: {
    type: Number,
    default: 0
  },

  averageRating: {
    type: Number,
    default: 0
  },

  reviewCount: {
    type: Number,
    default: 0
  },

  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

courseSchema.index({ tenantId: 1, status: 1 });
courseSchema.index({ tenantId: 1, category: 1 });
courseSchema.index({ tenantId: 1, nqfLevel: 1 });
courseSchema.index({ status: 1, category: 1 });

courseSchema.virtual("moduleCount").get(function () {
  return this.modules ? this.modules.length : 0;
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

if (mongoose.models.Course) {
  delete mongoose.models.Course;
}

export default mongoose.models.Course || mongoose.model("Course", courseSchema);