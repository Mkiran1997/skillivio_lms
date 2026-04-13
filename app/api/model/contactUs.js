import mongoose from "mongoose";
const contactUsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    company: { type: String, required: true },
    noOfLMs: { type: Number, required: true },
    jobTitle: { type: String, required: true },
    country: { type: String, required: true },
    industry: { type: String, required: true },
    status: { type: String, required: true },
    // date:{type:String,required:true},
    type: { type: String, required: true }
  },
  { timestamps: true },
);

export default mongoose.models.contactUs ||
  mongoose.model("contactUs", contactUsSchema);
