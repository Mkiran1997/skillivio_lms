// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import enrollment from "@/app/api/model/enrollment";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const enrollments = await enrollment.findById(paramsRes.id)
      .populate("userId")
      .populate("courseId");
    if (!enrollments) return NextResponse.json({ error: "enrollments not found" }, { status: 404 });
    return NextResponse.json({ ...enrollments.toObject(), id: enrollments._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const data = await req.json();
    const enrollments = await enrollment.findByIdAndUpdate(paramsRes.id, data, { new: true });
    if (!enrollments) return NextResponse.json({ error: "enrollments not found" }, { status: 404 });
    return NextResponse.json({ ...enrollments.toObject(), id: enrollments._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const enrollments = await enrollment.findByIdAndDelete(paramsRes.id);
    if (!enrollments) return NextResponse.json({ error: "enrollments not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}