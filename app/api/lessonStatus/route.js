import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LessonStatus from "@/models/lessonStatus";
import Lesson from "@/models/lesson";
import Enrollment from "@/models/enrollment";
import Course from "@/models/course";
import Learner from "@/models/learner";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get("enrollmentId");
    const learnerId = searchParams.get("learnerId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");

    const query = {};
    if (enrollmentId) query.enrollmentId = enrollmentId;
    if (learnerId) query.learnerId = learnerId;
    if (courseId) query.courseId = courseId;
    if (status) query.status = status;

    const lessonStatuses = await LessonStatus.find(query)
      .populate("lessonId")
      .populate({
        path: "enrollmentId",
        populate: [
          { path: "courseId" },
          { path: "learnerId" }
        ]
      })
      .lean();

    const mapped = lessonStatuses.map(ls => ({
      ...ls,
      id: ls._id.toString(),
    }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { enrollmentId, lessonId, learnerId, courseId, status, progress, assessment } = data;

    if (!enrollmentId || !lessonId || !learnerId || !courseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lessonStatus = await LessonStatus.findOneAndUpdate(
      { enrollmentId, lessonId },
      {
        learnerId,
        courseId,
        status: status || "completed",
        progress: progress || {},
        assessment: assessment || {}
      },
      { new: true, upsert: true }
    );

    // Update Enrollment progress if status is completed
    if (status === "completed" || !status) { // Defaulting to completed if not provided, assuming "Mark as Complete" action
      const completedCount = await LessonStatus.countDocuments({
        enrollmentId,
        status: "completed"
      });

      const enrollment = await Enrollment.findById(enrollmentId).populate("courseId");
      if (enrollment) {
        // Find total lessons in course
        const course = await Course.findById(enrollment.courseId._id).populate("modules");
        let totalLessons = 0;
        if (course && course.modules) {
          // This requires populating all lessons across all modules to get a true count
          // Alternative: if the course model has a 'lessons' count field, use that.
          // Based on previous view, course model seems to have a 'lessons' number field.
          totalLessons = course.lessons || 0;
        }

        const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        await Enrollment.findByIdAndUpdate(enrollmentId, {
          "progress.lessonsCompleted": completedCount,
          "progress.totalLessons": totalLessons,
          "progress.percentage": percentage,
          status: percentage === 100 ? "completed" : "in-progress"
        });
      }
    }

    return NextResponse.json({
      ...lessonStatus.toObject(),
      id: lessonStatus._id.toString(),
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}