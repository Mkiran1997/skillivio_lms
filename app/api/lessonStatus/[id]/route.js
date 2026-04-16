import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LessonStatus from "@/models/lessonStatus";
import Lesson from "@/models/lesson";
import Enrollment from "@/models/enrollment";
import Course from "@/models/course";
import Learner from "@/models/learner";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const lessonStatusDoc = await LessonStatus.findById(id)
      .populate("lessonId")
      .populate({
        path: "enrollmentId",
        populate: [
          { path: "courseId" },
          { path: "learnerId" }
        ]
      })
      .lean();

    if (!lessonStatusDoc) {
      return NextResponse.json({ error: "LessonStatus not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...lessonStatusDoc,
      id: lessonStatusDoc._id.toString(),
    });
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
      ...(data.progress && { progress: data.progress }),
      ...(data.assessment !== undefined && { assessment: data.assessment }),
      ...(data.notes !== undefined && { notes: data.notes }),
    };

    const lessonStatus = await LessonStatus.findByIdAndUpdate(id, updateData, { new: true })
      .populate("lessonId")
      .populate("enrollmentId")
      .lean();

    if (!lessonStatus) {
      return NextResponse.json({ error: "LessonStatus not found" }, { status: 404 });
    }
    return NextResponse.json({ ...lessonStatus, id: lessonStatus._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const lessonStatus = await LessonStatus.findByIdAndDelete(id);
    if (!lessonStatus) {
      return NextResponse.json({ error: "LessonStatus not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}