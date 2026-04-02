import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import bankDetail from "@/Server/model/bankDetail";

export async function GET() {
    try {
        await dbConnect();
        const bankDetails = await bankDetail.find();
        const mapped = bankDetails.map(c => ({ ...c.toObject(), id: c._id.toString() }));
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
        const bankDetails = await bankDetail.create(data);
        return NextResponse.json({ ...bankDetails.toObject(), id: bankDetails._id.toString() });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

