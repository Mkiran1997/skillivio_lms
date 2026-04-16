import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
    index: "text"
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    index: true
  },

  phone: {
    type: String,
    trim: true,
    default: null
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false
  },

  avatar: {
    type: String,
    default: null
  },

  roles: {
    type: String,
    enum: ["learner", "admin", "superAdmin"],
    default: "learner",
    index: true
  },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: [true, "Tenant is required"],
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  passwordResetToken: {
    type: String,
    default: null,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },

  lastLogin: {
    type: Date,
    default: null
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },

  twoFactorSecret: {
    type: String,
    select: false,
    default: null
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.twoFactorSecret;
      return ret;
    }
  }
});

userSchema.index({ email: 1, tenantId: 1 }, { unique: true });
userSchema.index({ tenantId: 1, roles: 1 });
userSchema.index({ tenantId: 1, isActive: 1 });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return ;
  // next();
  this.password = await bcrypt.hash(this.password, 12);
  // next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasRole = function(roles) {
  return this.roles === roles;
};

userSchema.statics.findByTenantEmail = function(email, tenantId) {
  return this.findOne({ email, tenantId });
};


export default mongoose.models.User || mongoose.model("User", userSchema);