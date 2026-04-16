import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Module from "@/models/module";
import Lesson from "@/models/lesson";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id, moduleId } = resolvedParams;
    
    const moduleDoc = await Module.findById(moduleId)
      .populate({
        path: "lessons"
      })
      .lean();

    if (!moduleDoc) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json(moduleDoc);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id, moduleId } = resolvedParams;
    const data = await req.json();
    const { name, description, order, isOptional, weight, lessons } = data;

    const updateData = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(order && { order }),
      ...(isOptional !== undefined && { isOptional }),
      ...(weight !== undefined && { weight }),
    };

    const updatedModule = await Module.findByIdAndUpdate(moduleId, updateData, { new: true });

    if (!updatedModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    if (lessons && Array.isArray(lessons)) {
      updatedModule.lessons = lessons;
      await updatedModule.save();
    }

    return NextResponse.json({
      ...updatedModule.toObject(),
      id: updatedModule._id.toString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id, moduleId } = resolvedParams;

    const moduleDoc = await Module.findByIdAndDelete(moduleId);
    if (!moduleDoc) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}