import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tenant name is required"],
    trim: true,
    maxlength: [200, "Name cannot exceed 200 characters"]
  },

  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    index: true
  },

  domain: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    index: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },

  phone: {
    type: String,
    // required: true,
    trim: true
  },

  branding: {
    primary: {
      type: String,
      required: true,
      default: "#3B82F6"
    },
    secondary: {
      type: String,
      required: true,
      default: "#1E40AF"
    },
    accent: {
      type: String,
      required: true,
      default: "#8B5CF6"
    },
    logo: {
      type: String,
      default: null
    },
    favicon: {
      type: String,
      default: null
    }
  },

  tagline: {
    type: String,
    default: null,
    maxlength: 500
  },

  businessInfo: {
    registrationNumber: {
      type: String,
      default: null
    },
    vatNumber: {
      type: String,
      default: null
    },
    physicalAddress: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: "South Africa" }
    },
    postalAddress: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: "South Africa" }
    }
  },

  qcto: {
    accreditationNumber: {
      type: String,
      default: null
    },
    setaAffiliation: {
      type: String,
      default: null
    },
    qctoAuditEnabled: {
      type: Boolean,
      default: true
    },
    autoGenerateQCTO: {
      type: Boolean,
      default: true
    }
  },

  tier: {
    type: String,
    enum: ["foundation", "professional", "enterprise"],
    default: "foundation",
    index: true
  },

  mrr: {
    type: Number,
    default: 0
  },

  limits: {
    maxLearners: {
      type: Number,
      default: 5
    },
    maxCourses: {
      type: Number,
      default: 10
    },
    maxStorage: {
      type: Number,
      default: 1073741824
    }
  },

  settings: {
    timezone: {
      type: String,
      default: "Africa/Johannesburg"
    },
    currency: {
      type: String,
      default: "ZAR"
    },
    language: {
      type: String,
      default: "en"
    },
    dateFormat: {
      type: String,
      default: "DD/MM/YYYY"
    }
  },

  status: {
    type: String,
    enum: ["pending", "active", "suspended", "cancelled"],
    default: "pending",
    index: true
  },

  setupDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

tenantSchema.index({ status: 1, tier: 1 });
tenantSchema.index({ isActive: 1 });

tenantSchema.virtual("learnerCount", {
  ref: "Learner",
  localField: "_id",
  foreignField: "tenantId",
  count: true
});

tenantSchema.set("toJSON", { virtuals: true });
tenantSchema.set("toObject", { virtuals: true });

export default mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);