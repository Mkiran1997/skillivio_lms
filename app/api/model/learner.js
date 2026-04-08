import mongoose from "mongoose";
const learnersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    cohort: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.learners ||
  mongoose.model("learners", learnersSchema);
