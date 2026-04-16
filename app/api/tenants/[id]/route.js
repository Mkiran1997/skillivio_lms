// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import tenant from "@/models/tenant";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const tenants = await tenant.findById(paramsRes.id);
    if (!tenants) return NextResponse.json({ error: "tenant not found" }, { status: 404 });
    return NextResponse.json({ ...tenants.toObject(), id: tenants._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const data = await req.json();
    const tenants = await tenant.findByIdAndUpdate(paramsRes.id, data, { new: true });
    if (!tenants) return NextResponse.json({ error: "tenant not found" }, { status: 404 });
    return NextResponse.json({ ...tenants.toObject(), id: tenants._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const tenants = await tenant.findByIdAndDelete(paramsRes.id);
    if (!tenants) return NextResponse.json({ error: "tenant not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}