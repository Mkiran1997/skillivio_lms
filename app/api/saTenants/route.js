import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/tenant";

export async function GET() {
    try {
        await dbConnect();
        const tenants = await Tenant.find().lean();
        const mapped = tenants.map(t => ({ ...t, id: t._id.toString() }));
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
        const tenant = await Tenant.create(data);
        return NextResponse.json({ ...tenant.toObject(), id: tenant._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}