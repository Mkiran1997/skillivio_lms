import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user";
import Tenant from "@/models/tenant";
import Learner from "@/models/learner";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const tenantId = searchParams.get("tenantId");

        const query = {};
        if (tenantId) {
            query.tenantId = tenantId;
        }

        const users = await User.find(query).select("-password").lean();
        const mapped = users.map(u => ({
            ...u,
            id: u._id.toString(),
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
        const { tenantId, roles, cohortId } = data;

        const tenantExists = await Tenant.findById(tenantId);
        if (!tenantExists) {
            return NextResponse.json({ error: "Invalid tenantId" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email: data.email, tenantId });
        if (existingUser) {
            return NextResponse.json({ error: "Email already exists in this tenant" }, { status: 409 });
        }

        const userData = {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            tenantId,
            roles: roles || "learner",
            avatar: data.avatar,
        };

        const newUser = await User.create(userData);

        let learner = null;
        if (roles === "learner" || !roles) {
            learner = await Learner.create({
                userId: newUser._id,
                tenantId,
                cohortId: cohortId || null,
            });
        }

        const response = newUser.toObject();
        delete response.password;

        return NextResponse.json({
            ...response,
            id: newUser._id.toString(),
            learner
        });

    } catch (err) {
        console.error("POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}