import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import learner from "@/app/api/model/learner";

export async function GET() {
    try {
        await dbConnect();
        const learners = await learner.find();
        const mapped = learners.map(c => ({ ...c.toObject(), id: c._id.toString() }));
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
        const learners = await learner.create(data);
        return NextResponse.json({ ...learners.toObject(), id: learners._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

