import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import saTenant from "@/app/api/model/saTenants";

export async function GET() {
    try {
        await dbConnect();
        const saTenants = await saTenant.find();
        const mapped = saTenants.map(c => ({ ...c.toObject(), id: c._id.toString() }));
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
        const saTenants = await saTenant.create(data);
        return NextResponse.json({ ...saTenants.toObject(), id: saTenants._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

