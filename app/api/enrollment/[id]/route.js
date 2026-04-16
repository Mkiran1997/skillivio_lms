import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Enrollment from "@/models/enrollment";
import Learner from "@/models/learner";
import Course from "@/models/course";
import Module from "@/models/module";
import Lesson from "@/models/lesson";
import { ObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const enrollment = await Enrollment.findById(id)
      .populate("learnerId")
      .populate({
        path: "courseId",
        populate: { path: "modules", populate: { path: "lessons" } }
      })
      .lean();
      
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    return NextResponse.json({ ...enrollment, id: enrollment._id.toString() });
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
      ...(data.status && { status: data.status }),
      ...(data.qualification && { qualification: data.qualification }),
      ...(data.entryRequirements && { entryRequirements: data.entryRequirements }),
      ...(data.entryAssessment !== undefined && { entryAssessment: data.entryAssessment }),
      ...(data.declaration !== undefined && { declaration: data.declaration }),
      ...(data.popiaConsent !== undefined && { popiaConsent: data.popiaConsent }),
      ...(data.provider !== undefined && { provider: data.provider }),
      ...(data.documents !== undefined && { documents: data.documents }),
      ...(data.progress !== undefined && { progress: data.progress }),
      ...(data.completion !== undefined && { completion: data.completion }),
      ...(data.qctoDisclaimerAccepted !== undefined && { qctoDisclaimerAccepted: data.qctoDisclaimerAccepted }),
      ...(data.introAccepted !== undefined && { introAccepted: data.introAccepted }),
      ...(data.instructionsAck !== undefined && { instructionsAck: data.instructionsAck }),
    };

    const enrollment = await Enrollment.findByIdAndUpdate(id, updateData, { new: true })
      .populate("learnerId")
      .populate("courseId")
      .lean();
      
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    return NextResponse.json({ ...enrollment, id: enrollment._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}