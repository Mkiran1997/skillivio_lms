import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Cohort from "@/models/cohort";
import Course from "@/models/course";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const cohort = await Cohort.findById(id)
      .populate("courseId")
      .lean();
      
    if (!cohort) return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    return NextResponse.json({ ...cohort, id: cohort._id.toString() });
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
      ...(data.name && { name: data.name }),
      ...(data.intakeNumber && { intakeNumber: data.intakeNumber }),
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.status && { status: data.status }),
      ...(data.maxLearners !== undefined && { maxLearners: data.maxLearners }),
      ...(data.notes !== undefined && { notes: data.notes }),
    };

    const cohort = await Cohort.findByIdAndUpdate(id, updateData, { new: true })
      .populate("courseId")
      .lean();
      
    if (!cohort) return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    return NextResponse.json({ ...cohort, id: cohort._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const cohort = await Cohort.findByIdAndDelete(id);
    if (!cohort) return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}