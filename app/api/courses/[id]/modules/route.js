import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/course";
import Module from "@/models/module";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const courseId = resolvedParams.id;
    
    const modules = await Module.find({ courseId })
      .populate({
        path: "lessons"
      })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json(modules);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const data = await req.json();
    const courseId = resolvedParams.id;
    const { name, description, order, isOptional, weight } = data;

    const existingModules = await Module.countDocuments({ courseId });
    const moduleOrder = order || existingModules + 1;

    const moduleData = {
      name,
      description: description || null,
      courseId,
      order: moduleOrder,
      isOptional: isOptional || false,
      weight: weight || 10,
    };

    const newModule = await Module.create(moduleData);

    await Course.findByIdAndUpdate(courseId, {
      $push: { modules: newModule._id }
    });

    return NextResponse.json({
      ...newModule.toObject(),
      id: newModule._id.toString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}