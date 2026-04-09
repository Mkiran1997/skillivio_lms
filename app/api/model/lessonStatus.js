import mongoose from "mongoose";

const lessonStatusSchema = new mongoose.Schema(
  {
    moduleName: { type: String, require: true },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lesson",
      required: true,
    },
    enrollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    status: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.lessonStatus ||
  mongoose.model("lessonStatus", lessonStatusSchema);
