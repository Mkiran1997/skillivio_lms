import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Learner from "@/models/learner";
import User from "@/models/user";
import Cohort from "@/models/cohort";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");
    const cohortId = searchParams.get("cohortId");
    const status = searchParams.get("status");

    const query = {};
    if (tenantId) query.tenantId = tenantId;
    if (cohortId) query.cohortId = cohortId;
    if (status) query.status = status;

    const learners = await Learner.find(query)
      .populate({
        path: "userId",
        select: "-password",
        populate: { path: "tenantId" }
      })
      .populate({
        path: "cohortId"
      })
      .lean();

    const mapped = learners.map(l => ({
      ...l,
      id: l._id.toString(),
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
    const { userId, tenantId, cohortId, demographics, contact, employment, emergencyContact } = data;

    const learnerData = {
      userId,
      tenantId,
      cohortId: cohortId || null,
      demographics: demographics || {},
      contact: contact || {},
      employment: employment || {},
      emergencyContact: emergencyContact || {},
    };

    const learner = await Learner.create(learnerData);
    return NextResponse.json({
      ...learner.toObject(),
      id: learner._id.toString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}