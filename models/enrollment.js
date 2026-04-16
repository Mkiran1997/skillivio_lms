import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true
  },

  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Learner",
    required: true,
    index: true
  },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true
  },

  qualification: {
    saqaId: {
      type: String,
      default: null
    },
    nqfLevel: {
      type: Number,
      default: null
    },
    credits: {
      type: Number,
      default: 0
    },
    intakeNumber: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    plannedEndDate: {
      type: Date,
      default: null
    },
    actualEndDate: {
      type: Date,
      default: null
    },
    deliveryMode: {
      type: String,
      enum: ["face-to-face", "blended", "workplace-based"],
      default: "blended"
    }
  },

  entryRequirements: [{
    requirement: {
      type: String,
      required: true
    },
    submitted: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: String,
      default: null
    },
    verifiedDate: {
      type: Date,
      default: null
    },
    documentUrl: {
      type: String,
      default: null
    }
  }],

  entryAssessment: {
    conducted: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: null
    },
    outcome: {
      type: String,
      enum: ["competent", "bridging", "not-competent", null],
      default: null
    },
    assessorName: {
      type: String,
      default: null
    },
    assessorSignature: {
      type: String,
      default: null
    }
  },

  declaration: {
    agreed: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    signature: {
      type: String,
      default: null
    },
    date: {
      type: Date,
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    }
  },

  popiaConsent: {
    granted: {
      type: Boolean,
      default: false
    },
    signature: {
      type: String,
      default: null
    },
    date: {
      type: Date,
      default: null
    }
  },

  provider: {
    entryVerified: {
      type: Boolean,
      default: false
    },
    learnerApproved: {
      type: Boolean,
      default: false
    },
    qctoSubmittedDate: {
      type: Date,
      default: null
    },
    representativeName: {
      type: String,
      default: null
    },
    representativeSignature: {
      type: String,
      default: null
    },
    approvalDate: {
      type: Date,
      default: null
    }
  },

  documents: {
    certifiedId: {
      type: String,
      default: null
    },
    highestQualification: {
      type: String,
      default: null
    },
    cv: {
      type: String,
      default: null
    },
    studyPermit: {
      type: String,
      default: null
    },
    workplaceConfirmation: {
      type: String,
      default: null
    },
    entryAssessmentRecord: {
      type: String,
      default: null
    },
    proofOfPayment: {
      type: String,
      default: null
    }
  },

  status: {
    type: String,
    enum: [
      "draft", "submitted", "pending-review", "approved",
      "enrolled", "in-progress", "completed", "withdrawn", "cancelled"
    ],
    default: "draft",
    index: true
  },

  progress: {
    lessonsCompleted: {
      type: Number,
      default: 0
    },
    totalLessons: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  completion: {
    finalAssessmentScore: {
      type: Number,
      default: null
    },
    finalAssessmentPassed: {
      type: Boolean,
      default: null
    },
    finalAssessmentDate: {
      type: Date,
      default: null
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null
    }
  },

  qctoDisclaimerAccepted: {
    type: Boolean,
    default: false
  },

  introAccepted: {
    type: Boolean,
    default: false
  },

  instructionsAck: {
    type: Boolean,
    default: false
  },

  submittedAt: {
    type: Date,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ tenantId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ "qualification.intakeNumber": 1 });
enrollmentSchema.index({ tenantId: 1, "qualification.startDate": 1 });

enrollmentSchema.pre("save", async function () {
  if (this.isModified("status") && this.status === "submitted" && !this.submittedAt) {
    this.submittedAt = new Date();
  }
  if (this.isModified("status") && this.status === "approved" && !this.approvedAt) {
    this.approvedAt = new Date();
  }
});

export default mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);