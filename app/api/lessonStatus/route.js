import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import lessonStatus from "@/app/api/model/lessonStatus";
import enrollment from "@/app/api/model/enrollment";
import lesson from "@/app/api/model/lesson";
import { populate } from "dotenv";

export async function GET() {
  try {
    await dbConnect();

    const lessonStatuses = await lessonStatus
      .find()
      .populate("lessonId")
      .populate({
        path: "enrollId",
        populate: [
          {
            path: "courseId",
            populate: {
              path: "modules",
              populate: { path: "lessons" },
            },
          },
          {
            path: "learnerId", // This adds the learner details to the enrollment
          },
        ],
      });

    const mapped = lessonStatuses.map((u) => {
      const obj = u.toObject();
      return {
        ...obj,
        id: obj._id.toString(),
        enroll: obj.enrollId,
        lesson: obj.lessonId, // overwrite tenant with ID
      };
    });
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Step 1: Ensure DB connection
    await dbConnect();

    // Step 2: Parse the incoming request body as JSON
    const data = await req.json();

    // Step 3: Validate the tenantId (optional based on your logic)
    if (data.lessonId) {
      const lessonExists = await lesson.findById(data.lessonId);
      if (!lessonExists) {
        return NextResponse.json(
          { error: "Invalid tenantId" },
          { status: 400 },
        );
      }
    }
    if (data.enrollId) {
      const enrollExists = await enrollment.findById(data.enrollId);
      if (!enrollExists) {
        return NextResponse.json(
          { error: "Invalid tenantId" },
          { status: 400 },
        );
      }
    }

    // Step 4: Create a new lessonStatus document using the incoming data
    const newLessonStatus = await lessonStatus.create({
      moduleName: data.moduleName,
      lessonId: data.lessonId,
      enrollId: data.enrollId,
      status: data.status || "", // Default to empty string if no status is provided
    });

    // Step 5: Return the created lessonStatus with its id
    return NextResponse.json({
      ...newLessonStatus.toObject(),
      id: newLessonStatus._id.toString(), // Convert ObjectId to string for frontend use
    });
  } catch (err) {
    // Step 6: Handle errors and log them
    console.error("POST error:", err);

    // Return an error response
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
