import mongoose from "mongoose";

const bankDetailSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    unique: true,
    index: true
  },

  accountName: {
    type: String,
    required: true
  },

  bank: {
    type: String,
    required: true
  },

  accountNumber: {
    type: String,
    required: true
  },

  branchCode: {
    type: String,
    required: true
  },

  accountType: {
    type: String,
    enum: ["current", "savings"],
    required: true
  },

  payShapId: {
    type: String,
    default: null
  },

  settings: {
    acceptCash: {
      type: Boolean,
      default: true
    },
    acceptEft: {
      type: Boolean,
      default: true
    },
    acceptPayShap: {
      type: Boolean,
      default: true
    },
    acceptCreditCard: {
      type: Boolean,
      default: false
    }
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verifiedAt: {
    type: Date,
    default: null
  },

  verifiedBy: {
    type: String,
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.BankDetail || mongoose.model("BankDetail", bankDetailSchema);