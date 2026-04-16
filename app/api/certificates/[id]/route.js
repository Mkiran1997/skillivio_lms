import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Certificate from "@/models/certificate";
import Learner from "@/models/learner";
import Course from "@/models/course";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const certificate = await Certificate.findById(id)
      .populate("learnerId")
      .populate("courseId")
      .lean();
      
    if (!certificate) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    return NextResponse.json({ ...certificate, id: certificate._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    
    const updateData = {
      ...(data.pdfUrl && { pdfUrl: data.pdfUrl }),
      ...(data.isValid !== undefined && { isValid: data.isValid }),
      ...(data.revocationReason && { revocationReason: data.revocationReason }),
    };

    if (data.isValid === false && !data.revocationReason) {
      updateData.revokedAt = new Date();
    }

    const certificate = await Certificate.findByIdAndUpdate(id, updateData, { new: true })
      .populate("learnerId")
      .populate("courseId")
      .lean();
      
    if (!certificate) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    return NextResponse.json({ ...certificate, id: certificate._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const certificate = await Certificate.findByIdAndDelete(id);
    if (!certificate) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}