import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import enrollment from "@/app/api/model/enrollment";
import learners from "@/app/api/model/learner";

export async function GET() {
    try {
        await dbConnect();
        const enrollments = await enrollment.find()
            .populate("learnerId")
            .populate("courseId");
        const mapped = enrollments.map(c => ({ ...c.toObject(), id: c._id.toString() }));
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
        const enrollments = await enrollment.create(data);
        return NextResponse.json({ ...enrollments.toObject(), id: enrollments._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

