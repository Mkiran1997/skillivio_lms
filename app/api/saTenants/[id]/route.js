// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import saTenant from "@/app/api/model/saTenants";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const saTenants = await saTenant.findById(paramsRes.id);
    if (!saTenants) return NextResponse.json({ error: "saTenant not found" }, { status: 404 });
    return NextResponse.json({ ...saTenants.toObject(), id: saTenants._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const data = await req.json();
    const saTenants = await saTenant.findByIdAndUpdate(paramsRes.id, data, { new: true });
    if (!saTenants) return NextResponse.json({ error: "saTenant not found" }, { status: 404 });
    return NextResponse.json({ ...saTenants.toObject(), id: saTenants._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const saTenants = await saTenant.findByIdAndDelete(paramsRes.id);
    if (!saTenants) return NextResponse.json({ error: "saTenant not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}