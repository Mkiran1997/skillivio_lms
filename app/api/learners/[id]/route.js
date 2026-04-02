// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import learner from "@/Server/model/learner";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const learners = await learner.findById(paramsRes.id);
    if (!learners) return NextResponse.json({ error: "learner not found" }, { status: 404 });
    return NextResponse.json({ ...learners.toObject(), id: learners._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const data = await req.json();
    const learners = await learner.findByIdAndUpdate(paramsRes.id, data, { new: true });
    if (!learners) return NextResponse.json({ error: "learner not found" }, { status: 404 });
    return NextResponse.json({ ...learners.toObject(), id: learners._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const learners = await learner.findByIdAndDelete(paramsRes.id);
    if (!learners) return NextResponse.json({ error: "learner not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}