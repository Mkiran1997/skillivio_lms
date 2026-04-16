import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import tenant from "@/models/tenant";

export async function GET() {
    try {
        await dbConnect();
        const tenants = await tenant.find();
        const mapped = tenants.map(c => ({ ...c.toObject(), id: c._id.toString() }));
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
        const tenants = await tenant.create(data);

        return NextResponse.json({ ...tenants.toObject(), id: tenants._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

