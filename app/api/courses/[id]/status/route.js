import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Course from "@/app/api/model/course";
export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const paramsRes = await params;
        const { status } = await req.json();

        const course = await Course.findByIdAndUpdate(
            paramsRes.id,
            { status },
            { new: true }
        );

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}