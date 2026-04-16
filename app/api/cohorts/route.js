import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Cohort from "@/models/cohort";
import Course from "@/models/course";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");

    const query = {};
    if (tenantId) query.tenantId = tenantId;
    if (courseId) query.courseId = courseId;
    if (status) query.status = status;

    const cohorts = await Cohort.find(query)
      .populate("courseId")
      .lean();

    const mapped = cohorts.map(c => ({
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
    const { name, tenantId, courseId, intakeNumber, startDate, endDate, maxLearners, notes } = data;

    const cohortData = {
      name,
      tenantId,
      courseId,
      intakeNumber,
      startDate,
      endDate,
      maxLearners: maxLearners || 30,
      notes: notes || null,
    };

    const cohort = await Cohort.create(cohortData);
    return NextResponse.json({
      ...cohort.toObject(),
      id: cohort._id.toString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}