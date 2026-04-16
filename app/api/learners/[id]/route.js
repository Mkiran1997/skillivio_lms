import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Learner from "@/models/learner";
import User from "@/models/user";
import Cohort from "@/models/cohort";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const learner = await Learner.findById(id)
      .populate({
        path: "userId",
        select: "-password"
      })
      .populate({
        path: "cohortId"
      })
      .lean();
      
    if (!learner) return NextResponse.json({ error: "Learner not found" }, { status: 404 });
    return NextResponse.json({ ...learner, id: learner._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    
    const updateData = {
      ...(data.cohortId !== undefined && { cohortId: data.cohortId }),
      ...(data.demographics && { demographics: data.demographics }),
      ...(data.contact && { contact: data.contact }),
      ...(data.employment && { employment: data.employment }),
      ...(data.emergencyContact && { emergencyContact: data.emergencyContact }),
      ...(data.status && { status: data.status }),
      ...(data.totalCredits !== undefined && { totalCredits: data.totalCredits }),
      ...(data.popiaConsent !== undefined && { popiaConsent: data.popiaConsent }),
      ...(data.isComplete !== undefined && { isComplete: data.isComplete }),
    };

    const learner = await Learner.findByIdAndUpdate(id, updateData, { new: true })
      .populate({
        path: "userId",
        select: "-password"
      })
      .lean();
      
    if (!learner) return NextResponse.json({ error: "Learner not found" }, { status: 404 });
    return NextResponse.json({ ...learner, id: learner._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const learner = await Learner.findByIdAndDelete(id);
    if (!learner) return NextResponse.json({ error: "Learner not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}