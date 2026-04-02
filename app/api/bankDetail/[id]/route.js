// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import bankDetail from "@/Server/model/bankDetail";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const bankDetails = await bankDetail.findById(paramsRes.id);
    if (!bankDetails) return NextResponse.json({ error: "bankDetails not found" }, { status: 404 });
    return NextResponse.json({ ...bankDetails.toObject(), id: bankDetails._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const data = await req.json();
    const bankDetails = await bankDetail.findByIdAndUpdate(paramsRes.id, data, { new: true });
    if (!bankDetails) return NextResponse.json({ error: "bankDetails not found" }, { status: 404 });
    return NextResponse.json({ ...bankDetails.toObject(), id: bankDetails._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes=await params;
    const bankDetails = await bankDetail.findByIdAndDelete(paramsRes.id);
    if (!bankDetails) return NextResponse.json({ error: "bankDetails not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}