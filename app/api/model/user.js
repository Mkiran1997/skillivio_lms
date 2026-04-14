import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    avatar: {
      type: String
    },

    password: {
      type: String,
      required: true
    },

    roles: {
      type: String,
      enum: ["learner", "admin", "superAdmin"],
      default: "learner"
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tenants",
      required: true,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


userSchema.index({ email: 1, tenantId: 1 }, { unique: true });


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});


// Export Model
export default mongoose.models.users || mongoose.model("users", userSchema);