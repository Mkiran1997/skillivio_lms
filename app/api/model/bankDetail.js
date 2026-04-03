import mongoose from "mongoose";
const bankDetailSchema = new mongoose.Schema({
    accountName: { type: String, required: true },
    bank: { type: String, required: true },
    accountNo: { type: String, required: true },
    branchCode: { type: Number, required: true },
    accountType: { type: String, required: true },
    payShapId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.bankDetail || mongoose.model('bankDetail', bankDetailSchema);
