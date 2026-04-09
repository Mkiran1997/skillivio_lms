// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import lessonStatus from "../../model/lessonStatus";
import lesson from "../../model/lesson";
import enrollment from "../../model/enrollment";

export async function GET(req, { params }) {
  try {
    // Step 1: Ensure DB connection
    await dbConnect();

    // Step 2: Fetch the lessonStatus document by ID
    const lessonStatusDoc = await lessonStatus
      .findById(params.id)
      .populate('lessonId')
      .populate('enrollId');

    if (!lessonStatusDoc) {
      return NextResponse.json({ error: "LessonStatus not found" }, { status: 404 });
    }

    // Step 3: Return the found lessonStatus
    return NextResponse.json({
      ...lessonStatusDoc.toObject(),
      id: lessonStatusDoc._id.toString(),
      lesson: lessonStatusDoc.lessonId,
      enroll: lessonStatusDoc.enrollId,
    });
  } catch (err) {
    console.error("GET by ID error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    // Step 1: Ensure DB connection
    await dbConnect();

    // Step 2: Parse the incoming request body
    const data = await req.json();

    // Step 3: Validate lessonId and enrollId if provided
    if (data.lessonId) {
      const lessonExists = await lesson.findById(data.lessonId);
      if (!lessonExists) {
        return NextResponse.json(
          { error: "Invalid lessonId" },
          { status: 400 },
        );
      }
    }

    if (data.enrollId) {
      const enrollExists = await enrollment.findById(data.enrollId);
      if (!enrollExists) {
        return NextResponse.json(
          { error: "Invalid enrollId" },
          { status: 400 },
        );
      }
    }

    // Step 4: Find the existing lessonStatus by ID and update
    const updatedLessonStatus = await lessonStatus
      .findByIdAndUpdate(
        params.id,
        data,
        { new: true }, // Return the updated document
      )
      .populate("lessonId")
      .populate("enrollId");

    if (!updatedLessonStatus) {
      return NextResponse.json(
        { error: "LessonStatus not found" },
        { status: 404 },
      );
    }

    // Step 5: Return the updated lessonStatus
    return NextResponse.json({
      ...updatedLessonStatus.toObject(),
      id: updatedLessonStatus._id.toString(),
      lesson: updatedLessonStatus.lessonId,
      enroll: updatedLessonStatus.enrollId,
    });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  try {
    // Step 1: Ensure DB connection
    await dbConnect();

    // Step 2: Delete the lessonStatus document by ID
    const deletedLessonStatus = await lessonStatus.findByIdAndDelete(params.id);

    if (!deletedLessonStatus) {
      return NextResponse.json({ error: "LessonStatus not found" }, { status: 404 });
    }

    // Step 3: Return success message
    return NextResponse.json({ message: "LessonStatus deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
