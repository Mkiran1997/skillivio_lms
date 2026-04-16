import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Certificate from "@/models/certificate";
import Learner from "@/models/learner";
import Course from "@/models/course";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");
    const learnerId = searchParams.get("learnerId");
    const courseId = searchParams.get("courseId");
    const isValid = searchParams.get("isValid");

    const query = {};
    if (tenantId) query.tenantId = tenantId;
    if (learnerId) query.learnerId = learnerId;
    if (courseId) query.courseId = courseId;
    if (isValid !== null) query.isValid = isValid === "true";

    const certificates = await Certificate.find(query)
      .populate("learnerId")
      .populate("courseId")
      .lean();

    const mapped = certificates.map(c => ({
      ...c,
      id: c._id.toString(),
    }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    const { enrollmentId, learnerId, courseId, tenantId, learnerName, courseName, finalScore, nqfLevel, credits } = data;

    const certificateNumber = Certificate.generateNumber(tenantId, courseId);

    const certData = {
      certificateNumber,
      enrollmentId,
      learnerId,
      courseId,
      tenantId,
      learnerName,
      courseName,
      finalScore: finalScore || null,
      nqfLevel,
      credits,
    };

    const certificate = await Certificate.create(certData);
    return NextResponse.json({
      ...certificate.toObject(),
      id: certificate._id.toString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}