import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/Server/model/course";

export async function GET() {
    try {
        await dbConnect();
        const courses = await Course.find();
        const mapped = courses.map(c => ({ ...c.toObject(), id: c._id.toString() }));
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
        const course = await Course.create(data);
        return NextResponse.json({ ...course.toObject(), id: course._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

