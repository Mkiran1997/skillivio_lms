// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/app/api/model/course";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const course = await Course.findById(paramsRes.id);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ ...course.toObject(), id: course._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const data = await req.json();
    const course = await Course.findByIdAndUpdate(paramsRes.id, data, { new: true });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ ...course.toObject(), id: course._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const course = await Course.findByIdAndDelete(paramsRes.id);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}