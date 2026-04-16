import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true
  },

  phone: {
    type: String,
    default: null
  },

  company: {
    type: String,
    default: null
  },

  jobTitle: {
    type: String,
    default: null
  },

  numberOfLearners: {
    type: Number,
    default: null
  },

  industry: {
    type: String,
    default: null
  },

  country: {
    type: String,
    default: "South Africa"
  },

  source: {
    type: String,
    enum: ["website", "referral", "linkedin", "advertisement", "other"],
    default: "website"
  },

  message: {
    type: String,
    default: null
  },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["new", "contacted", "qualified", "proposal", "converted", "lost"],
    default: "new",
    index: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  notes: {
    type: String,
    default: null
  },

  followUpDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

contactUsSchema.index({ tenantId: 1, status: 1 });
contactUsSchema.index({ tenantId: 1, createdAt: -1 });

export default mongoose.models.ContactUs || mongoose.model("ContactUs", contactUsSchema);