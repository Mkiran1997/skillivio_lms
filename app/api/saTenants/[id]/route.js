import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/tenant";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const tenant = await Tenant.findById(paramsRes.id).lean();
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    return NextResponse.json({ ...tenant, id: tenant._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const data = await req.json();
    const tenant = await Tenant.findByIdAndUpdate(paramsRes.id, data, { new: true });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    return NextResponse.json({ ...tenant.toObject(), id: tenant._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const tenant = await Tenant.findByIdAndDelete(paramsRes.id);
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}