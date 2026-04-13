import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import contactUs from "@/app/api/model/contactUs";

export async function GET() {
  try {
    await dbConnect();
    const contactus = await contactUs.find()
    const mapped = contactus.map((c) => ({
      ...c.toObject(),
      id: c._id.toString(),
    }));
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
    console.log(data);
    const contactus = await contactUs.create(data);
    return NextResponse.json({
      ...contactus.toObject(),
      id: contactus._id.toString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
