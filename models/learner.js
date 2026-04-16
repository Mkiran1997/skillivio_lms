import mongoose from "mongoose";

const learnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true
  },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true
  },

  cohortId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cohort",
    default: null,
    index: true
  },

  demographics: {
    idNumber: {
      type: String,
      trim: true,
      default: undefined
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say", null],
      default: null
    },
    nationality: {
      type: String,
      default: "South African"
    },
    homeLanguage: {
      type: String,
      default: null
    },
    race: {
      type: String,
      enum: ["african", "coloured", "indian", "white", "other", null],
      default: null
    }
  },

  contact: {
    phone: {
      type: String,
      default: null,
      
    },
    altEmail: {
      type: String,
      default: null
    },
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: "South Africa" }
    }
  },

  employment: {
    employer: {
      type: String,
      default: null
    },
    jobTitle: {
      type: String,
      default: null
    },
    workAddress: {
      type: String,
      default: null
    },
    workPhone: {
      type: String,
      default: null
    },
    startDate: {
      type: Date,
      default: null
    }
  },

  emergencyContact: {
    name: {
      type: String,
      default: null
    },
    relationship: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    }
  },

  status: {
    type: String,
    enum: ["active", "inactive", "suspended", "graduated", "withdrawn"],
    default: "active",
    index: true
  },

  totalCredits: {
    type: Number,
    default: 0
  },

  popiaConsent: {
    granted: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: null
    }
  },

  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  isComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

learnerSchema.index({ tenantId: 1, cohortId: 1 });
learnerSchema.index({ tenantId: 1, status: 1 });
learnerSchema.index({ tenantId: 1, "demographics.idNumber": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "demographics.idNumber": { $exists: true, $ne: null }
    }
  });

learnerSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true
});

learnerSchema.set("toJSON", { virtuals: true });
learnerSchema.set("toObject", { virtuals: true });

export default mongoose.models.Learner || mongoose.model("Learner", learnerSchema);