import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import user from "@/app/api/model/user";
import tenant from "@/app/api/model/tenant";
import Learner from "@/app/api/model/learner";

export async function GET() {
    try {
        await dbConnect();

        const users = await user.find().populate('tenantId');

        const mapped = users.map(u => {
            const obj = u.toObject();
            return {
                ...obj,
                id: obj._id.toString(),
                tenant: obj.tenantId // overwrite tenant with ID
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
        await dbConnect();
        const data = await req.json();

        const tenantExists = await tenant.findById(data.tenantId);
        if (!tenantExists) {
            return NextResponse.json({ error: "Invalid tenantId" }, { status: 400 });
        }

        // ✅ Create user
        const newUser = await user.create(data);

        let learner = null;

        const existingLearner = await Learner.findOne({ userId: newUser._id });
        // ✅ Only create learner if role is "learner"
        if (!existingLearner && data.roles?.includes("learner")) {
            learner = await Learner.create({
                userId: newUser?._id,
                cohort: data?.cohort || ""
            });
        }

        return NextResponse.json({
            ...newUser.toObject(),
            id: newUser._id.toString(),
            learner // will be null if not learner
        });

    } catch (err) {
        console.error("POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}