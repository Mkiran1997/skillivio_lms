import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import user from "@/app/api/model/user";
import tenant from "@/app/api/model/tenant";

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

        const newUser = await user.create(data);

        return NextResponse.json({ ...newUser.toObject(), id: newUser._id.toString() });
    } catch (err) {
        console.error("POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

